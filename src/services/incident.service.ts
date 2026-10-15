
import { Incident } from "../models/incident.model";

// Datos para registrar incidencias
export interface CreateIncidentDTO {
  title: string;
  description: string;
  location: string;
  category:
    | "electricidad"
    | "plomeria"
    | "limpieza"
    | "mobiliario"
    | "otro";
  priority: "baja" | "media" | "alta";
}

// Estados permitidos
export type IncidentStatus =
  | "pendiente"
  | "en_proceso"
  | "resuelta";

// ==========================================
// FEATURE 1: Registrar incidencia
// ==========================================
export const createIncident = async (
  data: CreateIncidentDTO
) => {
  try {
    const newIncident = await Incident.create(data);

    return newIncident;
  } catch (error) {
    console.error("Error al crear incidencia:", error);
    throw error;
  }
};

// ==========================================
// FEATURE 2: Consultar incidencias
// ==========================================
export const getIncidents = async (
  status?: IncidentStatus
) => {
  try {
    const filter = status ? { status } : {};

    const incidents = await Incident.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return incidents;
  } catch (error) {
    console.error("Error al consultar incidencias:", error);
    throw error;
  }
};

// ==========================================
// FEATURE 3: Actualizar estado
// ==========================================
export const updateIncidentStatus = async (
  id: string,
  status: IncidentStatus
) => {
  try {
    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { $set: { status } },
      {
        new: true,
        runValidators: true
      }
    );

    return updatedIncident;
  } catch (error) {
    console.error("Error al actualizar incidencia:", error);
    throw error;
  }
};
