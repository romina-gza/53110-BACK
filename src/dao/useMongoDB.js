import mongoose from "mongoose"
import { config } from "../config/config.js"

export const connectionMongoDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL)
        console.log('Conectado con MongoDB')
    } catch (err) {
        console.log("Fallo en la conexion:", err.message)
    }
}
connectionMongoDB()