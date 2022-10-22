//const { error } = require('console');
//call to filesystem
import fs from 'fs';
// save the path to json file
const addressJProduct='./src/data/products.json';
import '../loaders/connection.js';
import ProductModel from '../models/ProductModel.js'

//create the new class Book

class Book{
    //IIEF
    async read(){
        try{
            let data= await fs.promises.readFile(addressJProduct,'utf-8');
            return JSON.parse(data);
            
        }catch (err){return{status:400, message: err.message}}

    }

    async write(products){
        try{
            await fs.promises.writeFile(addressJProduct, JSON.stringify(products,null,2))
        }catch (err){return{status:400, message: err.message}}
        }

    async validationsID(id){
        try{
            if(!fs.existsSync(addressJProduct)) return {status:400, message:"not existence data base"};
            let products = await this.read();
            id=parseInt(id, 10);
            if(isNaN(id)) return {status:400, message:"not existence Id. Please, enter only numbers"};
            if(id<0)return {status:400, message:"not existence Id. Please, enter Id above 0"};
            if(id>products.length+1) return {status:400, message:"out of range"};
            return id;
                
        }catch (err){return{status:400, message: err.message}}
    }

    validationsProduct(product){
        if(!product.name||!product.price||!product.stock||!product.description||!product.code||!product.thumbnail) return{status:400, message: "all data fields is required"};
    }

    async save(req, res) {
    //     //validations
    this.validationsProduct(req.body);
        try{
            const createdProduct = await ProductModel.create(req.body)
            return res.status(200).json(createdProduct) 
        }
        catch(err){return res.status(400).json({message: "product not was save"})}
    //     this.validationsProduct(product);
    
    // try{
        
    //     if(fs.existsSync(addressJProduct)){
            
    //         let products= await this.read();
    //         let  id;
    //         //if all the contents of the file have been deleted id=0;
    //         if(products.length===0){id=0}
    //             id = products[products.length-1].id+1;
    //             const now = new Date();
    //             const timestamp = now.toLocaleString();
    //             product.price= parseFloat(product.price).toFixed(2);
    //             product.stock= parseInt(product.stock)
    //             product.code= parseInt(product.code)
                
    //         product= {
    //             id,
    //             timestamp,
    //             ...product
    //         }
    //         products.push(product);

    //         //now write whit private function
    //         await this.write(products);
    //         return{status:200, message: `Product  Created`, data:product};

    //     }else{

    //             const now = new Date();
    //             const timestamp = now.toLocaleString();
    //             product.price= parseFloat(product.price).toFixed(2);
    //             product.stock= parseInt(product.stock)
    //             product.code= parseInt(product.code)

    //             product= {
    //                 id:1,
    //                 timestamp,
    //                 ...product
    //             }

    //         await fs.promises.writeFile(addressJProduct, JSON.stringify([product],null,2))
            
    //         return{status:200, message: "Product created", data:product};

    //     }
    // }catch(err){
    //         return{status:400, message: err.message}
    //     }
    }

    async getAll(req , res) {

        const products = await ProductModel.find()
        return res.status(200).json(products)
        
        // if (fs.existsSync(addressJProduct)) {
        //     let products= await this.read();
        //     return {status: 200,message: "Hello GET ALL", data: products}         
        // }else{
        //     return {status: 400, message: "don't exist Database of Product"}
        // }
    }

    async getById(req, res) {
        //Validations
        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Id required"});

            await ProductModel.findByIdAndUpdate(id, req.body)
            return res.status(200).json({ message: 'Product updated!'})
        } catch(err) {
            return res.status(404).json({ message: 'Failed to update product'})
        }

        // if (!id) return {status: 400, message: "Id required"}
        // id=await this.validationsID(id);
        // try{
        //     let products = await this.read();
        //     let product = products.find(product => product.id === id)
        //     if (product) return {status: 200,message:"Product found:", data: product}
        //     return {status: 400, message: "Product not was found"}
        // } catch (err){
        //     return {status: 400, message: err.message}
        // }

    }

    
    
    updateById= async (id, product) => {
        //Validations
        if (!id) return {status: 400, message: "Id required"}
        id= await this.validationsID(id);
        this.validationsProduct(product);
            try{
                let products = await this.read();
                let elementIndex = products.findIndex((prod=> prod.id===id));
                    if (elementIndex!==-1){
                        const timestamp=products[elementIndex].timestamp;
                        product= {
                            id,
                            timestamp,
                            ...product
                        }
                    
                        products[elementIndex]=product;
                        await this.write(products);
                        let newUpdate = await this.getById(id);
                        return {status: 200, message:"product updated successfully: ", data: newUpdate}
                    }else{ 
                        return {status: 400, message: "Product not was found"}
                        
                    }
                    

            }catch(err){return{status:400, message: err.message} }
    }

    deleteById = async (id) => {
        //Validations
        if (!id) return {status: 400, message: "Id required"}
        id= await this.validationsID(id);
        try{
            let products = await this.read();
            
            let newProducts = products.filter(product => product.id !== id)
            
            await this.write(newProducts);
            return {status: 200, message: "Product has been DELETED!"}
        }catch{
            return {status: 400, message: "Delete failed!"}
        }
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
export {Book};