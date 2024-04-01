import { messagesModel } from "./model/messages.model.js";

export default class ChatManager{
    constructor() {    }

    async getMessages() {
        return await messagesModel.find().lean()
    }
}