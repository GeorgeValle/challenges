// i create connection object whit knex for export all methods from these library 
let SQLOptions= require("knex")({
    client: 'sqlite3',
    connection:{
        filename: ":/src/DB/ecommerce.sqlite3",
    },
    useNullAsDefault: true
})

module.exports= SQLOptions;