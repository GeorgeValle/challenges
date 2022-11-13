const mysql = require('../options/mysql.config');

const N_TABLE="products"
const Manager= require('../controllers/product.manager')
const manager = new Manager(mysql,N_TABLE);
let productsList = manager.findAll()
.then(products => products)
.catch(err => console.log(err))

module.exports = productsList;