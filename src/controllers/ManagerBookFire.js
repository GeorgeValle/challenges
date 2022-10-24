import {db} from '../loaders/ConnectionBase';
import { query, orderBy, where, collection, getDocs } from '@firebase/firestore';
import { doc, getDoc, updateDoc } from "firebase/firestore";

class Book{
    //IIEF
    constructor(){
    products = db.collection('products')
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
            return res.status(400).json({message: "product not was save"})
        }
    }

    async getAll(req , res) {
        try{
        let q;
        q = query(collection(db, "products"), orderBy('name'))
        const querySnapshot = await getDocs(q);
        const productsFromFirestore = querySnapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));
    return res.status(200).json(productsFromFirestore) ;
}catch(err){return res.status(404).json({ message: 'Failed to load products'})}


        // const products = await ProductModel.find()
        // return res.status(200).json(products)
    }

    async getById(req, res) {
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);
            let product;
            if (docSnap.exists()) {
                product ={
                id: id,
                ...docSnap.data()
                }
                return res.status(200).json(product)
            }         
        } catch(err) {
            // doc.data() will be undefined in this case
            return res.status(404).json({ message: 'Product does not exits'})
        }
    }


    updateById= async (req , res) => {
        //Validations
        try {
            const { id } = req.params
            this.validationsProduct(req.body);

            const washingtonRef = doc(db, "cities", "DC");

            // Set the "capital" field of the city 'DC'
            await updateDoc(washingtonRef, {
            capital: true
            });
            if (!id) return res.status(400).json( {message: "Id required"});
            await products.doc(req.body,id)
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