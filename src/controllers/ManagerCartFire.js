import {db} from '../loaders/ConnectionBase.js';
import CartModel from '../models/CartModel.js';
import book from './ManagerBookFire.js';

class Cart{
    
    constructor(){
        this.carts = db.collection('carts')
        }
    

    //receive a id of product
    save= async (req, res) => {
        try{
                const now = new Date();
                const timestamp = now.toLocaleString();
                let products=[];
                
                const createdCart = await this.carts.add(timestamp,products);
            
                return res.status(200).json(createdCart)
        }catch(err){
            console.log(err)
            return{status:400, message: "error cart not created"}
        }
    }

    //obtain a product from cart by id_prod
    getById = async (req,res) => {
        
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});
            const cart = await this.carts.doc(id).get();
            if (cart.exists) {
                let oneCart= { id:id, ...cart.data() }
                return res.status(200).json(oneCart)
            }else{
                return res.status(404).json({ message: "cart does not exits"})
            }       
        }catch (err){
            console.log(err);
            return res.status(400).json({ message:"Error: Cart not found!"})
        }
    }

        //add a product in a cart by delete
    updateById= async (req,res) => {
        const { id } = req.params;
        if (!id) return res.status(400).json( {message: "Id required"});
        const { id_prod } = req.params;
        if (!id_prod) return res.status(400).json( {message: " Product ID required"});

            try{
                let newProduct= await book.getBook(id_prod);

                const cart = await this.carts.doc(id).get();
            if (cart.exists) {
                const unionProd = await this.carts.doc(id).update({
                    products: FieldValue.arrayUnion(...products, newProduct)
                })
                        return res.status(200).json({message:"Cart updated successfully: ", data: unionProd}) 
                    }else{ 
                        return res.status(404).json({ message: 'Cart not found'})
                    }
            }catch(err){
                console.log(err);
                return res.status(400).json({ message: 'Failed to update the cart'});
            }
    }

    //delete a product from a cart
    deleteById = async (req,res) => {
        const { id } = req.params;
        if (!id) return res.status(400).json( {message: "Id required"});
        const { id_prod } = req.params;
        if (!id_prod) return res.status(400).json( {message: " Product ID required"});
        try{
            let deleteProduct= await book.getBook(id_prod);
            if(!deleteProduct){return res.status(404).json({ message: 'product not found'})}

            const cart = await this.carts.doc(id).get();
        if (cart.exists) {
            const removeProd = await this.carts.doc(id).update({
                products: FieldValue.arrayRemove(id_prod)
            })
                    return res.status(200).json({message:"Cart updated successfully: ", data: removeProd}) 
                }else{ 
                    return res.status(404).json({ message: 'Cart not found'})
                }
        }catch(err){
            console.log(err);
            return res.status(400).json({ message: 'Failed to delete product from the cart'});
        }
    }

    //delete a cart
    deleteCart = async (req,res) => {
        try {
            const { id } = req.params
            //Validation
            if (!id) return res.status(400).json( {message: "Id required"});
            const cartDeleted = await this.carts.doc(id).delete()
            if (!cartDeleted) return res.status(404).json({ message: 'Cart does not exists'})
            return res.status(200).json({ message: 'Cart deleted!'})
        }catch(err){
            console.log(err);
            return res.status(400).json({ message: 'Failed to delete cart'})
        }
    }

//end the class
}

export default new Cart();