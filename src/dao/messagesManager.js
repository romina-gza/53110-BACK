import { messagesModel } from "./model/messages.model.js";

export default class MessagesManager {
    constructor() {}

    // se utiliza para convertir los documentos recuperados de la base de datos en objetos JavaScript simples
    async getMessages() {
        return await messagesModel.find().lean()
    }

    async saveMessages(data) {
        return await messagesModel.create(data)
    }
}