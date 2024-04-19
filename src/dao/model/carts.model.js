import mongoose from "mongoose"

const cartsCollection = "carts"
const cartsSchema = new mongoose.Schema(
    {
        products: [
            {
                productId: {
                    type: String,
                    /* type: mongoose.Schema.Types.ObjectId,
                    ref: 'products', */ 
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: true
                }
            }
        ]
    },
    {
        // marca fecha de momento de creacion, actualizacion
        timestamps: true
    }
)

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)