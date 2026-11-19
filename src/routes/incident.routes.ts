
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

import {
  canChangeStatus
} from "../middleware/status.middleware";

const router = Router();

// ==========================================
// FEATURE 1: Registrar incidencias
// Usuario autenticado
// ==========================================
router.post(
  "/",
  requireAuth,
  createIncidentController
);

// ==========================================
// FEATURE 2: Consultar incidencias
// Usuario autenticado
// ==========================================
router.get(
  "/",
  requireAuth,
  getIncidentsController
);

// ==========================================
// FEATURE 3: Actualizar estado
// Administrador o tecnico asignado
// ==========================================
router.patch(
  "/:id/status",
  requireAuth,
  canChangeStatus,
  updateIncidentStatusController
);

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
