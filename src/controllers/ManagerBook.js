//const { error } = require('console');
//call to filesystem
// import fs from 'fs';
// save the path to json file
// const addressJProduct='./src/data/products.json';
import '../loaders/connection.js';
import ProductModel from '../models/ProductModel.js'

//create the new class Book

class Book{
    //IIEF
    
    validationsProduct(product){
        if(!product.name||!product.price||!product.stock||!product.description||!product.code||!product.thumbnail) return{status:400, message: "all data fields is required"};
    }

    async save(req, res) {
    try{    
        //validations
        this.validationsProduct(req.body);
        const createdProduct = await ProductModel.create(req.body)
        return res.status(200).json(createdProduct) 
        }catch(err){
            return res.status(400).json({message: "product not was save"})
        }
    }

    async getAll(req , res) {

        const products = await ProductModel.find()
        return res.status(200).json(products)
    }

    async getById(req, res) {
        
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});

            await ProductModel.findById(id, req.body)
            return res.status(200).json(product)
        } catch(err) {
            return res.status(404).json({ message: 'Product does not exits'})
        }

    }

    
    
    updateById= async (req , res) => {
        //Validations
        try {
            const { id } = req.params
            this.validationsProduct(req.body);
            if (!id) return res.status(400).json( {message: "Id required"});
            await ProductModel.findByIdAndUpdate(id, req.body)
            return res.status(200).json({ message: 'Product updated!'})
        } catch(err) {
            return res.status(404).json({ message: 'Failed to update product'})
        }

    }

    deleteById = async (id) => {
        //Validations
        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Id required"});
            const productDeleted = await ProductModel.findByIdAndDelete(id)
            if (!productDeleted) return res.status(404).json({ message: 'Product does not exists'})
            return res.status(200).json({ message: 'Product deleted!'})
        }catch(err){return res.status(404).json({ message: 'Failed to delete product'})}
    }

    deleteAll = async () => {
        if (fs.existsSync(addressJProduct)) {
            
            await this.write([]);
            return {status: 200, message: "Products DELETED!"}
        } else {
            return {status: 200, message: "Delete all failed!"}
        }
    }

}
export default new Book();