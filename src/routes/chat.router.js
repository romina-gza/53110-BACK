import { Router } from "express";
import messagesManager from "../dao/messagesManager.js";
import { accessMiddleware } from "../middleware/access.js";
export const chatRouter = Router()

let chat = new messagesManager()

chatRouter.get('/', async (req,res)=>{
    let conversation = await chat.getMessages()

    //res.setHeader('Content-Type', 'application/json')
    res.status(200).json(conversation)
})