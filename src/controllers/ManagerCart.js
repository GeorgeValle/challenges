import fs from 'fs';
// save the path to json file of Carts
const addressJProduct='./src/data/cartProducts.json';

//file of products
const addressProduct='./src/data/products.json';
import CartModel from '../models/CartModel.js';
import book from './ManagerBook.js';


class Cart{

    //receive a id of product
    save= async (req, res) => {
        //validations
        try{
            
            const createdCart = await CartModel.create();
        
            return res.status(200).json(createdCart)
        }catch(err){
            console.log(err)
            return{status:400, message: "error cart not created"}
        }
    }
    

    //obtain a product from cart by id_prod
    getById = async (req,res) => {
        //Validations
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});

            const cart = await CartModel.findById(id)
            if(!cart) return res.status(404).json({ message: 'Cart does not exits'})
            return res.status(200).json(cart)
        } catch(err) {
            console.log(err);
            return res.status(404).json({ message: 'Product does not exits'});
        }



        // if (!id) return {status: 400, message: "Id required"}

        // id=await this.validationsID(id);
        // try{
        //     let carts = await this.read();
        //     let cart = carts.find(cart => cart.id === id)
        //     if (cart) return {status: 200,message:"Cart found:", data: cart.products}
        //     return {status: 400, message: "Cart not was found"}
        // } catch (err){
        //     return {status: 400, message: err.message}
        // }
    }

    //call a product object by id
    
    getProduct= async (id_product) => {
        if (!id_product) return {status: 400, message: "Id required"}
        let id_prod= await this.validationsIDProduct(id_product);
        try{
        let newProduct=await book.getById(id_prod);
                        let product=newProduct.data;
                        return product;
        }catch (err){return{status:400, message: err.message}}
    }

        //add a product in a cart by delete
    updateById= async (id_cart, product) => {
        //Validations
        if (!id_cart) return {status: 400, message: "Id required"}
        if (!product) return {status: 400, message: "Product not was found"}
        let id= await this.validationsID(id_cart);
            try{
                let carts = await this.read();

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

                        await this.write(cartList);
                        
                        return {status: 200, message:"Cart updated successfully: ", data: product}
                    }else{ 
                        return {status: 400, message: "Product not was found"}
                        
                    }
            }catch(err){
                return{status:400, message: err.message};
            }
    }

    //delete a product from a cart
    deleteById = async (id_cart, id_product) => {
        //Validations
        if (!id_cart) return {status: 400, message: "Id cart required"};
        if (!id_product) return {status: 400, message: "Id product required"};

        let id= await this.validationsID(id_cart);
        let id_prod= await this.validationsIDProduct(id_product);
        try{
            //let carts = await this.#read();
            let data= await fs.promises.readFile(addressJProduct,'utf-8');
            let carts= JSON.parse(data);
            //search for cart index
            const elementIndex=carts.findIndex(cart=>cart.id===id)

            if(elementIndex==-1){return{status: 400, message: "product not was found"}}

                let cartProducts = carts[elementIndex].products;
                //extract the chosen product for delete
                carts[elementIndex].products= cartProducts.filter(prod=>prod.id!=id_prod)
            
            await this.write(carts);
            
            return {status: 200, message: "Product has been DELETED!"}
        }catch(err){
            return {status: 400, message: err.message}
        }
    }

    //delete a cart
    deleteCart = async (id_cart) => {
        if (!id_cart) return {status: 400, message: "Id cart required"};
        let id= await this.validationsID(id_cart);
        if (fs.existsSync(addressJProduct)) {
            let carts = await this.read();
            const elementIndex=carts.findIndex(cart=>cart.id==id)
            if(elementIndex===-1){return{status: 400, message: "Cart not was found"}}
            const cartList = carts.filter(cart=>cart.id!=id)
            await this.write(cartList);
            return {status: 200, message: "cart DELETED!", data:carts[elementIndex]}
        } else {
            return {status: 200, message: "DataBase not found!"}
        }
    }

}

export default new Cart();