const {MySQLOptions} = require('../options/mysql.config');

const N_TABLE="products"

let productsList = MySQLOptions(N_TABLE)
.where({}).select("id","title","price","thumbnail")//[]

module.exports = productsList;