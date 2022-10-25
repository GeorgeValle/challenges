import {db} from '../loaders/ConnectionBase.js';

class Book{
    //IIEF
    constructor(){
    this.products = db.collection('products')
    }
    validationsProduct(product){
        if(!product.name||!product.price||!product.stock||!product.description||!product.code||!product.thumbnail) return{status:400, message: "all data fields is required"};
    }

    async save(req, res) {
    try{    
        //validations
        this.validationsProduct(req.body);
        
        const createdProduct = await this.products.add(req.body)
        return res.status(200).json(createdProduct) 
        }catch(err){
            console.log(err)
            return res.status(400).json({message: "product not was save"})
        }
    }

    async getAll(req , res) {
        try{


            const querySnapshot = await this.products.get()
            const productsFromFirestore = querySnapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
                }));
            return res.status(200).json(productsFromFirestore) ;
        }catch(err){
            console.log(err)
            return res.status(400).json({ message: 'Failed to load products'})
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json({message: "Id required"});
            const item = await this.products.doc(id).get()
            
            if (item.exists) {
                let product= { id:id, ...item.data() }
                return res.status(200).json(product)
            }else{
                return res.status(404).json({ message: "Product does not exits"})
            }       
        } catch(err) {
            // doc.data() will be undefined in this case
            console.log(err);
            return res.status(400).json({ message:"Product not found!"});
        }
    }

    async getBook(id_product) {
        try {
            
            //Validations
            if (!id_product) return res.status(400).json({message: "Id required"});
            const item = await this.products.doc(id).get()
            
            if (item.exists) {
                return {id:id, ...item.data()}
                
            }else{
                return res.status(404).json({ message: "Product does not exits"})
            }       
        } catch(err) {
            // doc.data() will be undefined in this case
            console.log(err);
            return res.status(400).json({ message:"Product not found!"});
        }
    }


    updateById= async (req , res) => {
        //Validations
        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Id required"});
            this.validationsProduct(req.body);

            const item = await this.products.doc(id).get()
            if (item.exists) {
                await this.products.doc(id).set(req.body)
                return res.status(200).json({ message: 'Product updated!'})
            }else{
                return res.status(404).json({ message: 'Product to update not found!' })
            }
        } catch(err) {
            console.log(err);
            return res.status(400).json({ message: 'Failed to update product'})
        }

    }

    deleteById = async (req , res) => {
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});
            const productDeleted = await this.products.doc(id).delete()
            if (!productDeleted) return res.status(404).json({ message: 'Product does not exists'})
            return res.status(200).json({ message: 'Product deleted!'})
        }catch(err){
            console.log(err);
            return res.status(400).json({ message: 'Failed to delete product'})
        }
    }

}
export default new Book();