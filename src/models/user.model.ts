
import { Schema, model } from "mongoose";

// Modelo para los usuarios de CampusFix
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["reportante", "mantenimiento", "administrador"],
      default: "reportante"
    }
  },
  {
    timestamps: true
  }
);

// Exportar modelo
export const User = model("User", userSchema);
