
import { Router } from "express";

import {
  createIncidentController,
  getIncidentsController,
  updateIncidentStatusController
} from "../controllers/incident.controller";

const router = Router();

// ==========================================
// FEATURE 1: Registrar incidencias
// POST /api/incidents
// ==========================================
router.post("/", createIncidentController);

// ==========================================
// FEATURE 2: Consultar incidencias
// GET /api/incidents
// ==========================================
router.get("/", getIncidentsController);

// ==========================================
// FEATURE 3: Actualizar estado
// PATCH /api/incidents/:id/status
// ==========================================
router.patch("/:id/status", updateIncidentStatusController);

export default router;
