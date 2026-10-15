
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import {
  createIncident,
  getIncidents,
  updateIncidentStatus,
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
// FUNCIONES DE VALIDACION
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
// POST /api/incidents
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
      message: "Error interno al registrar la incidencia"
    });
  }
};

// ==========================================
// FEATURE 2: CONSULTAR INCIDENCIAS
// GET /api/incidents
// ==========================================

export const getIncidentsController = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {
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
// PATCH /api/incidents/:id/status
// ==========================================

export const updateIncidentStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {

  // Obtener ID de la URL
  const id = req.params.id;

  // Validar identificador de MongoDB
  if (
    typeof id !== "string" ||
    !isValidObjectId(id)
  ) {
    res.status(400).json({
      message: "Identificador de incidencia no válido"
    });
    return;
  }

  // Obtener datos enviados
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

  // Validar nuevo estado
  if (!isValidStatus(status)) {
    res.status(400).json({
      message: "Estado no válido",
      validStatuses
    });
    return;
  }

  try {
    // Actualizar incidencia en MongoDB
    const updatedIncident = await updateIncidentStatus(
      id,
      status
    );

    // Verificar si existe
    if (!updatedIncident) {
      res.status(404).json({
        message: "Incidencia no encontrada"
      });
      return;
    }

    // Respuesta exitosa
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
