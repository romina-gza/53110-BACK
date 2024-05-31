import mongoose from "mongoose"

const cartsCollection = "carts"
const cartsSchema = new mongoose.Schema(
    {
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: true
                }
            }
        ],
        totalPrice: { type: Number, required: true }
    },
    {
        // marca fecha de momento de creacion, actualizacion
        timestamps: true,
        versionKey: false
    }
)

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)