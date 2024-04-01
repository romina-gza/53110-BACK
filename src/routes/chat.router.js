import { Router } from "express";
import ChatManager from "../dao/chatManager.js";
export const chatRouter = Router()

let chat = new ChatManager()

chatRouter.get('/', async (req,res)=>{
    let conversation = await chat.getMessages()

    //res.setHeader('Content-Type', 'application/json')
    res.status(200).json(conversation)
})