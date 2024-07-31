import mongoose from "mongoose"
import { config } from "../config/config.js"
import { logger } from "../utils.js"

export const connectionMongoDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL)
        logger.info('Conectado con MongoDB!!')
    } catch (err) {
        logger.error(`Fallo en la conexion:  ${err.message}`)
    }
}
connectionMongoDB()