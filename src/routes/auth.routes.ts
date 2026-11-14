
import { Router } from "express";

import {
  registerController,
  loginController
} from "../controllers/auth.controller";

const router = Router();

// Registrar un nuevo usuario
router.post("/register", registerController);

// Iniciar sesión
router.post("/login", loginController);

export default router;
