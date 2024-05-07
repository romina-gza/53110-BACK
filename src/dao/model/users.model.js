import mongoose from "mongoose"
const usersColl = "users"

const usersSchema = new mongoose.Schema(
    {
        
        name: String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: String,
            enum: [ 'admin', 'user'],
            default: 'user'
        }
    },
    {
        versionKey: false
    }
)

export const usersModel = mongoose.model(usersColl, usersSchema)