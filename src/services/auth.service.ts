
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

// Registrar un usuario nuevo
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  // Normalizar el correo
  email = email.trim().toLowerCase();

  // Comprobar si ya existe
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  // Encriptar contraseña con hash
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar usuario en MongoDB
  const newUser = await User.create({
    name: name.trim(),
    email: email,
    password: hashedPassword
  });

  // Devolver datos sin contraseña
  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
};

// Iniciar sesión
export const loginUser = async (
  email: string,
  password: string
) => {

  // Buscar usuario por correo
  const user = await User.findOne({
    email: email.trim().toLowerCase()
  });

  if (!user) {
    return null;
  }

  // Comparar contraseñas
  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    return null;
  }

  // Obtener clave para generar el token
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no configurado");
  }

  // Generar token JWT
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role
    },
    secret,
    { expiresIn: "2h" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
