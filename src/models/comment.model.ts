
import { Schema, model } from "mongoose";

// Modelo para los comentarios de incidencias
const commentSchema = new Schema(
  {
    // Incidencia a la que pertenece el comentario
    incidentId: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      required: true
    },

    // Usuario que escribió el comentario
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Contenido del comentario
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500
    }
  },
  {
    timestamps: true,
    collection: "comments"
  }
);

// Exportar modelo
export const Comment = model(
  "Comment",
  commentSchema
);
