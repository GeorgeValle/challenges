// const fs = require('fs')

// const pathToFile = './chat.json'

class ChatManager {

    constructor(bd,table) {
        this.db=bd;
        this.table=table;
    };

    async create(message){
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

    async findAll(){
        let chat= result=JSON.parse(JSON.stringify(
        await this.db(this.table).where({}).select("email","msg","date")))
        ||[];
        return chat; 
    }
}

module.exports = ChatManager