
import { Schema, model } from "mongoose";

// Modelo de incidencias
const incidentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "electricidad",
        "plomeria",
        "limpieza",
        "mobiliario",
        "otro"
      ]
    },

    priority: {
      type: String,
      required: true,
      enum: ["baja", "media", "alta"]
    },

    status: {
      type: String,
      enum: ["pendiente", "en_proceso", "resuelta"],
      default: "pendiente"
    },

    // Empleado responsable de la incidencia
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true,
    collection: "incidents"
  }
);

// Exportar modelo
export const Incident = model(
  "Incident",
  incidentSchema
);
