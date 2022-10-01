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

        #validationsID= async(id)=>{
            try{
                if(!fs.existsSync(addressJProduct)) return {status:400, message:"not existence data base"};
                let products = await this.#read();
                id=parseInt(id, 10);
                if(isNaN(id)) return {status:400, message:"not existence Id. Please, enter only numbers"};
                if(id<0)return {status:400, message:"not existence Id. Please, enter Id above 0"};
                if(id>products.length+1) return {status:400, message:"out of range"};
                return id;
                    
            }catch (err){return{status:400, message: err.message}}
        }

    #validationsIDProduct= async(id)=>{
        try{
            if(!fs.existsSync(addressProduct)) return {status:400, message:"not existence data base"};
            let products = await this.#readProducts();
            id=parseInt(id, 10);
            if(isNaN(id)) return {status:400, message:"not existence Id. Please, enter only numbers"};
            if(id<0)return {status:400, message:"not existence Id. Please, enter Id above 0"};
            if(id>products.length) return {status:400, message:"out of range"};
            return id;
                
        }catch (err){return{status:400, message: err.message}}
    }


    // #validationsProduct= (product) => {
    //     if(!product.name||!product.price||!product.stock||!product.description||!product.code||!product.thumbnail) return{status:400, message: "all data fields is required"};
    // }

    //receive a id of product
    save= async () => {
        //validations
        //let id_prod = await this.#validationsIDProduct(idProduct);
    
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
                // let product=await book.getById(id_prod);
                // let newProduct=product.data;
                // console.log(product);
                // console.log(newProduct);
                

            let cart={
                id,
                timestamp,
                products:[]

                }
            
            //cart.products.push(newProduct)
            
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
                // let product=await book.getById(idProduct);
                // let newProduct=product.data;
                
                

                let cart= {
                    id:1,
                    timestamp,
                    products:[]    
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
            let carts = await this.#read();
            let cart = carts.find(cart => cart.id === id)
            if (cart) return {status: 200,message:"Cart found:", data: cart.products}
            return {status: 400, message: "Cart not was found"}
        } catch (err){
            return {status: 400, message: err.message}
        }
    }


    // getAll= async () => {
        
    //         if (fs.existsSync(addressJProduct)) {
    //             let products= await this.#read();
    //             return {status: 200,message: "Hello GET ALL", data: products}         
    //         }else{
    //             return {status: 400, message: "don't exist Database of Product"}
    //         }
    //     }
    

    getProduct= async (id_product) => {
        if (!id_product) return {status: 400, message: "Id required"}
        let id_prod= await this.#validationsIDProduct(id_product);
        try{
        let newProduct=await book.getById(id_prod);
                        let product=newProduct.data;
                        return product;
        }catch (err){return{status:400, message: err.message}}
    }


    updateById= async (id_cart, product) => {
        //Validations
        if (!id_cart) return {status: 400, message: "Id required"}

        let id= await this.#validationsID(id_cart);
        //let id_prod= await this.#validationsIDProduct(id_product);
            try{
                let carts = await this.#read();

                //carts not chosen
                const othersCarts =  carts.filter(elem=> elem.id!=id);
                //cart chosen
                let cart=  carts.find(elem=> elem.id==id);
                
                
                
                if(cart){

                    
                    
                    //transform because not is possibly cart.products.push(product);
                    let carrito =cart
                    
                    //push the param product 
                    carrito.products.push(product);
                    
                    //order the products
                    carrito.products.sort((a,b)=>a.id - b.id);
                    //push the cart updated in the filter
                    let cartList=othersCarts
                    cartList.push(carrito);
                    //order the filter
                    cartList.sort((a,b)=>a.id - b.id);
                        //push to file
                        await this.#write(cartList);
                        
                        return {status: 200, message:"Cart updated successfully: ", data: product}
                    }else{ 
                        return {status: 400, message: "Product not was found"}
                        
                    }
                    

            }catch(err){
                return{status:400, message: err.message};
            }

    }

    deleteById = async (id_cart, id_product) => {
        //Validations
        if (!id_cart) return {status: 400, message: "Id cart required"};
        if (!id_product) return {status: 400, message: "Id product required"};

        let id= await this.#validationsID(id_cart);
        let id_prod= await this.#validationsIDProduct(id_product);
        try{
            let carts = await this.#read();

            //carts not chosen
            const othersCarts = await carts.filter(elem=> elem.id!=id);
            
            //cart chosen
            const cart=  await carts.find(elem=> elem.id==id);
            if(cart){
                let carrito=cart
            let cartChosen= await carrito;

            console.log(cartChosen);
            //filter products not chosen
            const restProducts=cartChosen.filter(elem=> elem.id!=id_prod);
            console.log(restProducts);
            //product for delete
            const productDeleted=cartChosen.find(elem=> elem.id==id_prod);

            cartChosen.products.push(restProducts);
            cartChosen.products.sort((a, b) => a.id - b.id);
            const cartList =othersCarts;
            cartList.push(cartChosen);
            cartList.sort((a, b) => a.id - b.id);

            await this.#write(cartList);
            }else{return{status: 400, message: "product not was found"}}
            return {status: 200, message: "Product has been DELETED!", data: productDeleted}
        }catch(err){
            return {status: 400, message: err.message}
        }
    }

    // deleteAll = async () => {
    //     if (fs.existsSync(addressJProduct)) {
            
    //         await this.#write([]);
    //         return {status: 200, message: "Products DELETED!"}
    //     } else {
    //         return {status: 200, message: err.message}
    //     }
    // }




}


module.exports = Cart;