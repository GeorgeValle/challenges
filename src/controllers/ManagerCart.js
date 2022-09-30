//const { error } = require('console')

const fs=require('fs');
// save the path to json file of Carts
const addressJProduct='./src/data/cartProducts.json';

//file of products
const addressProduct='./src/data/products.json';

const Book=require('./ManagerBook');
const book = new Book();



class Cart{
    //IIEF
    #read= async()=>{
        try{
            let data= await fs.promises.readFile(addressJProduct,'utf-8');
            return JSON.parse(data);
            
        }catch (err){return{status:400, message: err.message}}
    }

    #readProducts = async()=>{
        try{
            let data= await fs.promises.readFile(addressProduct,'utf-8');
            return JSON.parse(data);
            
        }catch (err){return{status:400, message: err.message}}
    }

    #write= async(products)=>{
        try{
            await fs.promises.writeFile(addressJProduct, JSON.stringify(products,null,2))
        }catch (err){return{status:400, message: err.message}}
        }

    #validationsIDProduct= async(id)=>{
        try{
            if(!fs.existsSync(addressProduct)) return {status:400, message:"not existence data base"};
            let products = await this.#readProducts();
            id=parseInt(id, 10);
            if(isNaN(id)) return {status:400, message:"not existence Id. Please, enter only numbers"};
            if(id<0)return {status:400, message:"not existence Id. Please, enter Id above 0"};
            if(id>products.length+1) return {status:400, message:"out of range"};
            return id;
                
        }catch (err){return{status:400, message: err.message}}
    }

    #validationsProduct= (product) => {
        if(!product.name||!product.price||!product.stock||!product.description||!product.code||!product.thumbnail) return{status:400, message: "all data fields is required"};
    }

    //receive a id of product
    save= async (idProduct) => {
        //validations
        this.#validationsIDProduct(idProduct);
    
    try{
        
        if(fs.existsSync(addressJProduct)){
            
            let carts= await this.#read();
            let  id;
            //if all the contents of the file have been deleted id=0;
            if(carts.length===0){id=0}
                id = carts[carts.length-1].id+1;
                const now = new Date();
                const timestamp = now.toLocaleString();
                //read product
                let product=await book.getById(idProduct);
                let newProduct=product.data;

            let cart={
                id,
                timestamp,
                products:{
                    newProduct
                    }
                }
            
            
            
            // product= {
            //     id,
            //     timestamp,
            //     ...product
            // }
            carts.push(cart);

            
            //now write whit private function
            await this.#write(carts);
            return{status:200, message: `Cart  Created`, data:cart};

        }else{

                const now = new Date();
                const timestamp = now.toLocaleString();

                //read product
                let product=await book.getById(idProduct);
                let newProduct=product.data;
                

                let cart={
                    id:1,
                    timestamp,
                    products:{
                        newProduct
                    }
                }

            
                // product= {
                //     id:1,
                //     timestamp,
                //     ...product
                // }

            await fs.promises.writeFile(addressJProduct, JSON.stringify([cart],null,2))
            
            return{status:200, message: "Cart created", data:cart};

        }
    }catch(err){
            return{status:400, message: err.message}
        }
    }

    getById = async (id) => {
        //Validations
        if (!id) return {status: 400, message: "Id required"}
        id=await this.#validationsID(id);
        try{
            let products = await this.#read();
            let product = products.find(product => product.id === id)
            if (product) return {status: 200,message:"Product found:", data: product}
            return {status: 400, message: "Product not was found"}
        } catch (err){
            return {status: 400, message: err.message}
        }
    }


    getAll= async () => {
        
            if (fs.existsSync(addressJProduct)) {
                let products= await this.#read();
                return {status: 200,message: "Hello GET ALL", data: products}         
            }else{
                return {status: 400, message: "don't exist Database of Product"}
            }
        }
    

    updateById= async (id, product) => {
        //Validations
        if (!id) return {status: 400, message: "Id required"}
        id= await this.#validationsID(id);
        this.#validationsProduct(product);
            try{
                let products = await this.#read();
                let elementIndex = products.findIndex((prod=> prod.id===id));
                    if (elementIndex!==-1){
                        const timestamp=products[elementIndex].timestamp;
                        product= {
                            id,
                            timestamp,
                            ...product
                        }
                    

                        products[elementIndex]=product;
                        await this.#write(products);
                        let newUpdate = await this.getById(id);
                        return {status: 200, message:"product updated successfully: ", data: newUpdate}
                    }else{ 
                        return {status: 400, message: "Product not was found"}
                        
                    }
                    

            }catch(err){
                return{status:400, message: err.message};
            }

    }

    deleteById = async (id) => {
        //Validations
        if (!id) return {status: 400, message: "Id required"}
        id= await this.#validationsID(id);
        try{
            let products = await this.#read();
            
            let newProducts = products.filter(product => product.id !== id)
            
            await this.#write(newProducts);
            return {status: 200, message: "Product has been DELETED!"}
        }catch{
            return {status: 400, message: err.message}
        }
    }

    deleteAll = async () => {
        if (fs.existsSync(addressJProduct)) {
            
            await this.#write([]);
            return {status: 200, message: "Products DELETED!"}
        } else {
            return {status: 200, message: err.message}
        }
    }




}


module.exports = Cart;