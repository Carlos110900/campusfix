
import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/database";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    // Primero conectar a MongoDB
    await connectDB();

    // Después iniciar Express
    app.listen(PORT, () => {
      console.log("==================================");
      console.log("  CampusFix Backend iniciado");
      console.log("==================================");
      console.log(`Servidor: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log("==================================");
    });
  } catch (error) {
    console.error("No se pudo iniciar CampusFix:", error);
    process.exit(1);
  }
};

startServer();
