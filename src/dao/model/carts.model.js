import mongoose from "mongoose"

const cartsCollection = "carts"
const cartsSchema = new mongoose.Schema(
    {
        
    },
    {
        // marca fecha de momento de creacion, actualizacion
        timestamps: true
    }
)

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)