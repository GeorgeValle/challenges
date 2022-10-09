const fs = require('fs')

const pathToFile = './chat.json'

class ChatManager {

    constructor(bd,table) {
        this.db=bd;
        this.table=table;
    };

    create = async (message) => {
        try {
            
                
                message = {
                    email: message.email,
                    timestamp: new Date().toLocaleString(),
                    message: message.message
                }
                await this.db(this.table).insert(message)
                
                return [message]
        } catch(err) {
            return {status: "error", message: err.message}
        }
    }

    findAll = async () => {
        let chat;
        return chat = await this.db(this.table).where({}).select("email","msg","date")||[]
    }
}

module.exports = ChatManager