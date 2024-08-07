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
        status: {
            type: Boolean,
            default: true
        },
        stock: Number, 
        code: {
            type: Number,
            unique: true
        },
        category: String
        },
    {
        timestamps: true,
        versionKey: false,
        strict: true
    }
)

productsSchema.plugin(paginate)

export const productsModel = mongoose.model(productsCollection, productsSchema)