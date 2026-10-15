
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI no está definida en .env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB conectado correctamente");
    console.log(`Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("Error al conectar MongoDB:", error);
    throw error;
  }
};
