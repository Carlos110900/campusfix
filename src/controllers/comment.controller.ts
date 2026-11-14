
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import {
  addComment,
  getComments
} from "../services/comment.service";

// ==========================================
// FEATURE 6: AGREGAR COMENTARIO
// ==========================================

export const addCommentController = async (
  req: Request,
  res: Response
): Promise<void> => {

  // Obtener el ID de la incidencia
  const incidentId = req.params.id;

  // Obtener el usuario autenticado
  const userId = res.locals.userId;

  // Obtener el comentario
  const { text } = req.body || {};

  // Validar ID de la incidencia
  if (
    typeof incidentId !== "string" ||
    !isValidObjectId(incidentId)
  ) {
    res.status(400).json({
      message: "ID de incidencia no valido"
    });
    return;
  }

  // Validar el texto
  if (
    typeof text !== "string" ||
    text.trim().length < 3 ||
    text.trim().length > 500
  ) {
    res.status(400).json({
      message: "El comentario debe tener entre 3 y 500 caracteres"
    });
    return;
  }

  // Comprobar usuario autenticado
  if (!userId) {
    res.status(401).json({
      message: "Usuario no autenticado"
    });
    return;
  }

  try {
    // Guardar el comentario
    const comment = await addComment(
      incidentId,
      userId,
      text
    );

    // Comprobar si existe la incidencia
    if (!comment) {
      res.status(404).json({
        message: "Incidencia no encontrada"
      });
      return;
    }

    // Respuesta correcta
    res.status(201).json({
      message: "Comentario agregado correctamente",
      data: comment
    });

  } catch (error) {
    console.error("Error al agregar comentario:", error);

    res.status(500).json({
      message: "Error interno al agregar comentario"
    });
  }
};

// ==========================================
// FEATURE 6: CONSULTAR COMENTARIOS
// ==========================================

export const getCommentsController = async (
  req: Request,
  res: Response
): Promise<void> => {

  // Obtener el ID de la incidencia
  const incidentId = req.params.id;

  // Validar ID
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
    // Consultar los comentarios
    const comments = await getComments(incidentId);

    // Comprobar si existe la incidencia
    if (!comments) {
      res.status(404).json({
        message: "Incidencia no encontrada"
      });
      return;
    }

    // Respuesta correcta
    res.status(200).json({
      message: "Comentarios consultados correctamente",
      count: comments.length,
      data: comments
    });

  } catch (error) {
    console.error("Error al consultar comentarios:", error);

    res.status(500).json({
      message: "Error interno al consultar comentarios"
    });
  }
};
