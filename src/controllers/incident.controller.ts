
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import {
  createIncident,
  getIncidents,
  updateIncidentStatus,
  assignIncident,
  CreateIncidentDTO,
  IncidentStatus
} from "../services/incident.service";

// ==========================================
// VALORES PERMITIDOS
// ==========================================

const validCategories: CreateIncidentDTO["category"][] = [
  "electricidad",
  "plomeria",
  "limpieza",
  "mobiliario",
  "otro"
];

const validPriorities: CreateIncidentDTO["priority"][] = [
  "baja",
  "media",
  "alta"
];

const validStatuses: IncidentStatus[] = [
  "pendiente",
  "en_proceso",
  "resuelta"
];

// ==========================================
// VALIDACIONES
// ==========================================

const isValidCategory = (
  value: unknown
): value is CreateIncidentDTO["category"] => {
  return (
    typeof value === "string" &&
    validCategories.some(category => category === value)
  );
};

const isValidPriority = (
  value: unknown
): value is CreateIncidentDTO["priority"] => {
  return (
    typeof value === "string" &&
    validPriorities.some(priority => priority === value)
  );
};

const isValidStatus = (
  value: unknown
): value is IncidentStatus => {
  return (
    typeof value === "string" &&
    validStatuses.some(status => status === value)
  );
};

// ==========================================
// FEATURE 1: REGISTRAR INCIDENCIA
// ==========================================

export const createIncidentController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const input: unknown = req.body;

  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    res.status(400).json({
      message: "Debes enviar un objeto JSON válido"
    });
    return;
  }

  const {
    title,
    description,
    location,
    category,
    priority
  } = input as Record<string, unknown>;

  if (
    typeof title !== "string" ||
    title.trim().length < 3 ||
    title.trim().length > 100
  ) {
    res.status(400).json({
      message: "El título debe tener entre 3 y 100 caracteres"
    });
    return;
  }

  if (
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    res.status(400).json({
      message: "La descripción debe tener al menos 10 caracteres"
    });
    return;
  }

  if (
    typeof location !== "string" ||
    location.trim().length === 0
  ) {
    res.status(400).json({
      message: "La ubicación es obligatoria"
    });
    return;
  }

  if (!isValidCategory(category)) {
    res.status(400).json({
      message: "Categoría no válida",
      validCategories
    });
    return;
  }

  if (!isValidPriority(priority)) {
    res.status(400).json({
      message: "Prioridad no válida",
      validPriorities
    });
    return;
  }

  try {
    const incident = await createIncident({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      category,
      priority
    });

    res.status(201).json({
      message: "Incidencia registrada correctamente",
      data: incident
    });

  } catch (error) {
    console.error("Error al registrar incidencia:", error);

    res.status(500).json({
      message: "Error interno al registrar incidencia"
    });
  }
};

// ==========================================
// FEATURE 2: CONSULTAR INCIDENCIAS
// ==========================================

export const getIncidentsController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const status: unknown = req.query.status;

  if (
    status !== undefined &&
    !isValidStatus(status)
  ) {
    res.status(400).json({
      message: "Estado no válido",
      validStatuses
    });
    return;
  }

  try {
    const incidents = await getIncidents(status);

    res.status(200).json({
      message: "Incidencias consultadas correctamente",
      count: incidents.length,
      data: incidents
    });

  } catch (error) {
    console.error("Error al consultar incidencias:", error);

    res.status(500).json({
      message: "Error interno al consultar incidencias"
    });
  }
};

// ==========================================
// FEATURE 3: ACTUALIZAR ESTADO
// ==========================================

export const updateIncidentStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const id = req.params.id;

  if (
    typeof id !== "string" ||
    !isValidObjectId(id)
  ) {
    res.status(400).json({
      message: "Identificador de incidencia no válido"
    });
    return;
  }

  const input: unknown = req.body;

  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    res.status(400).json({
      message: "Debes enviar un objeto JSON válido"
    });
    return;
  }

  const { status } = input as Record<string, unknown>;

  if (!isValidStatus(status)) {
    res.status(400).json({
      message: "Estado no válido",
      validStatuses
    });
    return;
  }

  try {
    const updatedIncident = await updateIncidentStatus(
      id,
      status
    );

    if (!updatedIncident) {
      res.status(404).json({
        message: "Incidencia no encontrada"
      });
      return;
    }

    res.status(200).json({
      message: "Estado actualizado correctamente",
      data: updatedIncident
    });

  } catch (error) {
    console.error("Error al actualizar incidencia:", error);

    res.status(500).json({
      message: "Error interno al actualizar incidencia"
    });
  }
};

// ==========================================
// FEATURE 5: ASIGNAR INCIDENCIA
// ==========================================

export const assignIncidentController = async (
  req: Request,
  res: Response
): Promise<void> => {

  // Obtener ID de la incidencia
  const incidentId = req.params.id;

  if (
    typeof incidentId !== "string" ||
    !isValidObjectId(incidentId)
  ) {
    res.status(400).json({
      message: "ID de incidencia no válido"
    });
    return;
  }

  // Obtener ID del empleado
  const input: unknown = req.body;

  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    res.status(400).json({
      message: "Debes enviar un objeto JSON válido"
    });
    return;
  }

  const { userId } = input as Record<string, unknown>;

  if (
    typeof userId !== "string" ||
    !isValidObjectId(userId)
  ) {
    res.status(400).json({
      message: "ID de usuario no válido"
    });
    return;
  }

  try {
    // Llamar al servicio de asignación
    const result = await assignIncident(
      incidentId,
      userId
    );

    // Comprobar posibles errores
    if (result.error) {

      if (
        result.error === "Incidencia no encontrada" ||
        result.error === "Usuario no encontrado"
      ) {
        res.status(404).json({
          message: result.error
        });
        return;
      }

      res.status(400).json({
        message: result.error
      });
      return;
    }

    // Asignación exitosa
    res.status(200).json({
      message: "Incidencia asignada correctamente",
      data: result.incident
    });

  } catch (error) {
    console.error("Error al asignar incidencia:", error);

    res.status(500).json({
      message: "Error interno al asignar incidencia"
    });
  }
};
