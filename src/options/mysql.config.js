

// i create connection object whit knex for export all methods from these library 
let MySQLOptions =require("knex")( {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: "",
        database: "ecommerce",
    },
    pool:{min:0, max:10}
})



module.exports= MySQLOptions;