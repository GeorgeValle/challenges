//objet Knex mysql client
const myDB = require('./mysql.config');

const createTable1= async( myTable)=>{
    try{
        let message = ''
        if(!await myDB.schema.hasTable(myTable)){
            await myDB.schema.createTable(myTable, table => {
                table.increments('id')
                table.string('title')
                table.float('price')
                table.string('thumbnail')
            })
            message = `Table ${myTable} created - `
        }

        return {status: 'success', result: message}
    }catch (err){
        throw {status : 'Error', result : {msg : err.message, code : err.code}}
    }finally{
        //destroy tables connection
        myDB.destroy()
    }
}

module.exports = createTable1;