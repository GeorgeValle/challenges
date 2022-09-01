//call to filesystem

const fs=require('fs');
// save the path to json file
const addressJProduct='./products.txt';

//create the new class Container
class Contenedor{
    //IIFE
    #read= async()=>{
        try{
            let data= await fs.promises.readFile(addressJProduct,'utf-8');
            return JSON.parse(data);
            // return products;
        }catch (err){console.error(err)}
    }

    

    #write= async(products)=>{
        try{
            await fs.promises.writeFile(addressJProduct, JSON.stringify(products,null,2))
        }catch (err){console.error(err)}
    }

    save= async (product) => {
        //validations
        if(!product.title||!product.price||!product.thumbnail) return{status:"error", message: "missing product"}
    
    try{
        
        if(fs.existsSync(addressJProduct)){
            //esto era antes
            // let data= await fs.promises.readFile(addressJProduct,'utf-8');
            // let  products = JSON.parse(data); 
            let products= await this.#read();
            let  id = products[products.length-1].id+1;
            
            //products.id= (products) => products.reduce((max, prod) => prod.id > max ? prod.id : max, 0) + 1;
            product.id=id;
            products.push(product);

            //esto era antes
            //await fs.promises.writeFile(addressJProduct, JSON.stringify(products,null,2)) 

            //ahora escribe en un funcion
            this.#write(products);
            return{status:"success", message: `Product  Created`};

        }else{
            product.id=1;
            await fs.promises.writeFile(addressJProduct, JSON.stringify([product],null,2))
            
            return{status:"success", message: "Product created"}

        }


        }catch(err){
            return{status:"error", message: err.message}
        }
    }

    getById = async (id) => {
        //Validation
        if (!id) return {status: "error", message: "Id required"}
        if (fs.existsSync(addressJProduct)) {
            //antes
            // let data = await fs.promises.readFile(addressJProduct, 'utf-8')
            // let products = JSON.parse(data)
            let products = await this.#read();
            let product = products.find(product => product.id === id)
            if (product) return {status: "succes", message: product}
            return {status: "error", message: "Product not found"}
        } else {
            return {status: "error", message: err.message}
        }
    }

    getAll= async () => {
        if (fs.existsSync(addressJProduct)) {
            //asi estaba antes
            // let data = await fs.promises.readFile(addressJProduct, 'utf-8')
            // let products = JSON.parse(data)
            let products= await this.#read();
            return {status: "success", message: products}
        } else {
            return {status: "error", message: err.message}
        }
    }

    deleteById = async (id) => {
        //Validation
        if (!id) return {status: "error", message: "Id required"}
        if (fs.existsSync(addressJProduct)) {
            //antes
            // let data = await fs.promises.readFile(addressJProduct, 'utf-8')
            // let products = JSON.parse(data)
            let products = await this.#read();
            
            let newProducts = products.filter(product => product.id !== id)
            //este fue un intento fallido de slice
            // let indexId= products.findIdex(products.id===id)
            // let newProducts = products.slice(indexId);
            this.#write(newProducts);
            //esto estaba antes.
            //await fs.promises.writeFile(addressJProduct, JSON.stringify(newProducts, null, 2))
            return {status: "success", message: "Product deleted!"}
        } else {
            return {status: "error", message: err.message}
        }
    }

    deleteAll = async () => {
        if (fs.existsSync(addressJProduct)) {
            await fs.promises.writeFile(addressJProduct, JSON.stringify([],null,2))
            //intento falliudo de unLink
            //await fs.unLink(addressJProduct)
            
            return {status: "success", message: "Products deleted!"}
        } else {
            return {status: "error", message: err.message}
        }
    }
}

module.exports = Contenedor;

