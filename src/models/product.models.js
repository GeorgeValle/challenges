const mysql = require('../options/mysql.config');

const N_TABLE="products"

let productsList = mysql(N_TABLE)
.where({}).select("id","title","price","thumbnail")//[]

module.exports = productsList;