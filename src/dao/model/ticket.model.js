import mongoose from "mongoose"

const ticketCollection = 'ticket'
export const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: Number,
            unique: true
        },
        purchase_datetime: {
            type: String,
            default: new Date().toLocaleString()
        },
        amount: {
            type: Number
        }, 
        purcharser: {
            type: String
        }
    }, 
    {
        timestamps: true,
        versionKey: false,
})
export const ticketModel = mongoose.model(ticketCollection, ticketSchema)