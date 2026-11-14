
import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

// ==========================================
// FEATURE 4: REGISTRAR USUARIO
// ==========================================

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {

  // Obtener los datos enviados
  const { name, email, password } = req.body || {};

  // Comprobar que los datos sean correctos
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).json({
      message: "Nombre, correo y contraseña son obligatorios"
    });
    return;
  }

  // Validar nombre
  if (name.trim().length < 2) {
    res.status(400).json({
      message: "El nombre debe tener al menos 2 caracteres"
    });
    return;
  }

  // Validar correo
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    res.status(400).json({
      message: "El correo electrónico no es válido"
    });
    return;
  }

  // Validar contraseña
  if (password.length < 8 || password.length > 72) {
    res.status(400).json({
      message: "La contraseña debe tener entre 8 y 72 caracteres"
    });
    return;
  }

  try {
    // Registrar el usuario
    const user = await registerUser(
      name,
      email,
      password
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      data: user
    });

  } catch (error) {

    // Comprobar si el correo ya existe
    if (
      error instanceof Error &&
      error.message === "El correo ya está registrado"
    ) {
      res.status(409).json({
        message: "El correo ya está registrado"
      });
      return;
    }

    // También manejar un correo duplicado en MongoDB
    if (
      error !== null &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        message: "El correo ya está registrado"
      });
      return;
    }

    console.error("Error al registrar usuario:", error);

    res.status(500).json({
      message: "Error interno al registrar usuario"
    });
  }
};

// ==========================================
// FEATURE 4: INICIAR SESION
// ==========================================

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { email, password } = req.body || {};

  // Comprobar los datos recibidos
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim() === "" ||
    password === ""
  ) {
    res.status(400).json({
      message: "Correo y contraseña son obligatorios"
    });
    return;
  }

  try {
    // Buscar usuario y comprobar contraseña
    const result = await loginUser(
      email,
      password
    );

    // Credenciales incorrectas
    if (!result) {
      res.status(401).json({
        message: "Correo o contraseña incorrectos"
      });
      return;
    }

    // Inicio de sesión exitoso
    res.status(200).json({
      message: "Inicio de sesión correcto",
      token: result.token,
      user: result.user
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    res.status(500).json({
      message: "Error interno al iniciar sesión"
    });
  }
};
