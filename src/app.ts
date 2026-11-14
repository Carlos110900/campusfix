
import express, { Request, Response } from "express";
import cors from "cors";

// Rutas de CampusFix
import incidentRoutes from "./routes/incident.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Bienvenido a CampusFix",
    description: "API de gestión de incidencias universitarias",
    version: "1.0.0"
  });
});

// Verificar el servidor
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "CampusFix",
    message: "El servidor funciona correctamente"
  });
});

// Rutas de incidencias (Entregable 1)
app.use("/api/incidents", incidentRoutes);

// Rutas de autenticación (Entregable 2)
app.use("/api/auth", authRoutes);

export default app;
