//objet Knex sqlite client
const liteDB = require('./sqlite.config');

const createTable2= async( liteTable)=>{
    try{
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
    //destroy tables connection
    liteDB.destroy()}
}

module.exports = createTable2;