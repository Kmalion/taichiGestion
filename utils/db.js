import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const { MONGODB_URL } = process.env;

if (!MONGODB_URL) {
    throw new Error("Se debe definir MONGODB_URL");
}
const port = process.env.PORT || 3000
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGODB_URL);
        if (connection.connection.readyState === 1) {
            console.log("Conectado a MongoDB");
            return connection;  // Devuelve la conexión directamente
        }
    } catch (error) {
        console.log(error);
        throw error; // Lanza el error para ser manejado por el llamador
    }
};

export default connectDB;
