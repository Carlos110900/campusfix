
import { Schema, model } from "mongoose";

// Esquema de incidencias
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
