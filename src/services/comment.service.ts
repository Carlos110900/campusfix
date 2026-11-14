
import { Comment } from "../models/comment.model";
import { Incident } from "../models/incident.model";

// ==========================================
// FEATURE 6: AGREGAR COMENTARIO
// ==========================================

export const addComment = async (
  incidentId: string,
  userId: string,
  text: string
) => {
  try {
    // Buscar la incidencia
    const incident = await Incident.findById(incidentId);

    // Comprobar que exista
    if (!incident) {
      return null;
    }

    // Crear el comentario
    const newComment = await Comment.create({
      incidentId: incidentId,
      userId: userId,
      text: text.trim()
    });

    // Mostrar los datos del autor
    await newComment.populate("userId", "name role");

    return newComment;

  } catch (error) {
    console.error("Error al agregar comentario:", error);
    throw error;
  }
};

// ==========================================
// FEATURE 6: CONSULTAR COMENTARIOS
// ==========================================

export const getComments = async (
  incidentId: string
) => {
  try {
    // Buscar la incidencia
    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return null;
    }

    // Buscar comentarios de la incidencia
    const comments = await Comment.find({
      incidentId: incidentId
    })
      .populate("userId", "name role")
      .sort({ createdAt: 1 });

    return comments;

  } catch (error) {
    console.error("Error al consultar comentarios:", error);
    throw error;
  }
};
