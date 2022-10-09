const mysql = require('../options/mysql.config');

const N_TABLE="products"
try{
let productsList = mysql(N_TABLE)
.where({}).select("id","title","price","thumbnail")//[]
}catch(e){console.log(e)}
finally{(()=>mysql.destroy())}

module.exports = productsList;