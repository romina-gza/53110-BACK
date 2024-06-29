import mongoose from "mongoose"

const usersColl = "users"

const usersSchema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        age: Number,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: String,
            enum: [ 'admin', 'user' ],
            default: 'user'
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cart'
        }
    },
    {
        timestamps: true,
        versionKey: false,
        strict: false
    }
)

export const usersModel = mongoose.model(usersColl, usersSchema)