const MySQLOptions = require('./mysql.config');
const SQLOptions = require('./sqlite.config');
const knex = require ('knex');

const myDB = knex(MySQLOptions);
const liteDB = knex(SQLOptions);

const createTables= async( myTable,liteTable)=>{
    try{
        let message = ''
        if(!await myDB.schema.hasTable(myTable)){
            await myDB.schema.createTable(liteTable, table => {
                table.increments('id')
                table.string('title').nullable(false)
                table.float('price').nullable(false)
                table.string('thumbnail').nullable(false)
            })
            message = `Table ${myTable} created - `
        }

        if(!await liteDB.schema.hasTable(liteTable)){
            await liteDB.schema.createTable(liteTable, table => {
                table.increments('id')
                table.string('email')
                table.string('msg')
                table.time('date')
            })
            message += `Table ${liteTable} created`
        }
        return {status: 'success', result: message}
    }catch (err){
        throw {status : 'Error', result : {msg : err.message, code : err.code}}
    }finally{
        myDB.destroy()
        liteDB.destroy()
    }
}


module.exports = createTables;