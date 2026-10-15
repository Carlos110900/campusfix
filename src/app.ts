
import express, { Request, Response } from "express";
import cors from "cors";

// Importar rutas de incidencias
import incidentRoutes from "./routes/incident.routes";

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

// Verificar estado del servidor
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "CampusFix",
    message: "El servidor funciona correctamente"
  });
});

// Rutas de incidencias
app.use("/api/incidents", incidentRoutes);

export default app;
