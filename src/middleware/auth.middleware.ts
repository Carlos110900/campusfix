
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model";

// ==========================================
// COMPROBAR AUTENTICACION
// ==========================================

const checkAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
  adminOnly: boolean
): Promise<void> => {

  // Obtener el token
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Token requerido"
    });
    return;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    res.status(401).json({
      message: "Token requerido"
    });
    return;
  }

  // Obtener la clave secreta
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      message: "Error de configuracion del servidor"
    });
    return;
  }

  let userId: string;

  // Verificar que el token sea valido
  try {
    const data = jwt.verify(token, secret);

    if (
      typeof data === "string" ||
      typeof data.userId !== "string" ||
      !isValidObjectId(data.userId)
    ) {
      res.status(401).json({
        message: "Token no valido"
      });
      return;
    }

    userId = data.userId;

  } catch (error) {
    res.status(401).json({
      message: "Token invalido o vencido"
    });
    return;
  }

  try {
    // Buscar al usuario en MongoDB
    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({
        message: "Usuario no encontrado"
      });
      return;
    }

    // Verificar administrador cuando sea necesario
    if (adminOnly && user.role !== "administrador") {
      res.status(403).json({
        message: "Solo los administradores pueden realizar esta accion"
      });
      return;
    }

    // Guardar los datos del usuario para el controlador
    res.locals.userId = user._id.toString();
    res.locals.userRole = user.role;

    // Permitir continuar
    next();

  } catch (error) {
    console.error("Error al verificar usuario:", error);

    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};

// ==========================================
// CUALQUIER USUARIO AUTENTICADO
// ==========================================

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await checkAccess(req, res, next, false);
};

// ==========================================
// SOLAMENTE ADMINISTRADORES
// ==========================================

export const onlyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await checkAccess(req, res, next, true);
};
