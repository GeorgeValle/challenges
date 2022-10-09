

// i create connection object whit knex for export all methods from these library 
const MySQLOptions = require("knex")({
    client: process.env.DB_CLIENT||'mysql',
    connection: {
        host: process.env.DB_HOST||'127.0.0.1',
        user: process.env.DB_USER||'root',
        password:process.env.DB_PASSWORD||"",
        database: process.env.DB_NAME||"ecommerce"
    },
    pool:{min:0, max:10}
})



module.exports= MySQLOptions;