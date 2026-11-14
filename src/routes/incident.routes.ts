
import { Router } from "express";

import {
  createIncidentController,
  getIncidentsController,
  updateIncidentStatusController,
  assignIncidentController
} from "../controllers/incident.controller";

import {
  addCommentController,
  getCommentsController
} from "../controllers/comment.controller";

import {
  onlyAdmin,
  requireAuth
} from "../middleware/auth.middleware";

const router = Router();

// ==========================================
// FEATURE 1: Registrar incidencias
// ==========================================
router.post("/", createIncidentController);

// ==========================================
// FEATURE 2: Consultar incidencias
// ==========================================
router.get("/", getIncidentsController);

// ==========================================
// FEATURE 3: Actualizar estado
// ==========================================
router.patch("/:id/status", updateIncidentStatusController);

// ==========================================
// FEATURE 5: Asignar incidencia
// Solo administradores
// ==========================================
router.patch(
  "/:id/assign",
  onlyAdmin,
  assignIncidentController
);

// ==========================================
// FEATURE 6: Agregar comentario
// Usuario autenticado
// ==========================================
router.post(
  "/:id/comments",
  requireAuth,
  addCommentController
);

// ==========================================
// FEATURE 6: Consultar comentarios
// Usuario autenticado
// ==========================================
router.get(
  "/:id/comments",
  requireAuth,
  getCommentsController
);

export default router;
