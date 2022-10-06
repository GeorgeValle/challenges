


const MySQLOptions = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: "",
        database: "ecommerce"
    },
    pool:{min:0, max:10}
}

const SQLOptions={
    client: 'sqlite3',
    connection:{
        filename: ":/src/DB/ecommerce.sqlite3",
    },
    useNullAsDefault: true
}



module.exports= {MySQLOptions,SQLOptions}