//let products = require('../models/product.models')

//const {MySQLOptions} = require('../options/mysql.config');
//const knex = require('knex');

class ProductManager {

    constructor(bd,table) {

        this.db=bd;
        this.table=table;
    }



    async create(product){
        
        
        product={
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail
        }
        
        await this.db(this.table).insert(product)
        
    }

    findAll = () => {
    
        return this.db(this.table)
        .where({})
        .select("id","title","price","thumbnail")
        
        
    }

    async findById(params){
        id = parseInt(params)
        // return products.find(item => item.id === id)
        return await this.db(this.table)
        .where(id)
        .select("id","title","price","thumbnail")
    }

    async update(params, product){
        id = parseInt(params)
        await this.db(this.table)
        .where(id)
        .update(product)
        return this.findById(id)
    }

    async delete(params){
        id = parseInt(params)
        await this.db(this.table).where(id).del()
        
    }
}

module.exports = ProductManager