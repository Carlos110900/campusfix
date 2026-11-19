
import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { Incident } from "../models/incident.model";

// ==========================================
// COMPROBAR PERMISOS PARA CAMBIAR ESTADO
// ==========================================

export const canChangeStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  // Obtener datos del usuario autenticado
  const userId = res.locals.userId;
  const userRole = res.locals.userRole;

  // Obtener ID de la incidencia
  const incidentId = req.params.id;

  // Validar identificador
  if (
    typeof incidentId !== "string" ||
    !isValidObjectId(incidentId)
  ) {
    res.status(400).json({
      message: "ID de incidencia no valido"
    });
    return;
  }

  try {
    // Buscar la incidencia
    const incident = await Incident.findById(incidentId);

    if (!incident) {
      res.status(404).json({
        message: "Incidencia no encontrada"
      });
      return;
    }

    // El administrador tiene permiso
    if (userRole === "administrador") {
      next();
      return;
    }

    // Comprobar si es el tecnico asignado
    if (
      userRole === "mantenimiento" &&
      incident.assignedTo?.toString() === userId
    ) {
      next();
      return;
    }

    // Usuario sin permiso
    res.status(403).json({
      message: "No tienes permiso para cambiar esta incidencia"
    });

  } catch (error) {
    console.error("Error al comprobar permisos:", error);

    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};
