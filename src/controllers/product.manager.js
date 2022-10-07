//let products = require('../models/product.models')

const knex = require('knex');

class ProductManager {

    constructor(bd,table) {

        this.db=bd;
        this.table=table;
    }



    async create(product){
        
        await this.db(this.table).insert(product)
        return {status : 200, message: 'Product added successfully'}
    }

    findAll = () => {
    
        return this.db(this.table)
        .where({})
        .select("id","title","price","thumbnail")
        
        
    }

    findById = (id) => {
        id = parseInt(id)
        return products.find(item => item.id === id)
    }

    update = (id, product) => {
        id = parseInt(id)
        let newProducts = products.map(item => {
            if (item.id === id) {
                return {
                    id,
                    ...product
                }
            } else return item
        })
        products = newProducts
        return this.findById(id)
    }

    delete = (id) => {
        id = parseInt(id)
        let newProducts = products.filter(item => item.id !== id)
        products = newProducts
        return products
    }
}

module.exports = ProductManager