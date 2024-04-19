import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const productsCollection = "products"
const productsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: String, 
        thumbnails: [
            {
                type: String,
                default: "https://craftypixels.com/placeholder-image/250x200/7030f0/2d1b52&text=250x200"
            }
        ], 
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

productsSchema.plugin(paginate)

export const productsModel = mongoose.model(productsCollection, productsSchema)