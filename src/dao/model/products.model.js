import mongoose from "mongoose"

const productsCollection = "products"
const productsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: String, 
        thumbnails: String, 
        price: Number, 
        stock: Number, 
        code: Number,
        category: String
    },
    {
        // marca fecha de momento de creacion, actualizacion
        timestamps: true
    }
)

export const productsModel = mongoose.model(productsCollection, productsSchema)