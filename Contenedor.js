//call to filesystem

const fs=require('fs');
// save the path to json file
const addressJProduct='./products.json';

//create the new class Container
class Contenedor{
    //IIFE
    #read= async()=>{
        try{
            let data= await fs.promises.readFile(addressJProduct,'utf-8');
            return JSON.parse(data);
            
        }catch (err){console.error(err)}
    }

    

    #write= async(products)=>{
        try{
            await fs.promises.writeFile(addressJProduct, JSON.stringify(products,null,2))
        }catch (err){console.error(err)}
    }

    validationsID= async(id)=>{
        try{
            if(!fs.existsSync(addressJProduct)) return res.status(400).send({error:"not existence data base"});
            let products = await this.#read();
            if(isNaN(id)) return res.status(400).send({error:"not existence Id. Please, enter only numbers"});
            if(id<0)return res.status(400).send({error:"not existence Id. Please, enter Id above 0"});
            if(id>products.length+1) return res.status(400).send({error:"out of range"});
            return id;
            
        }catch (err){console.error(err)}
    }

    save= async (product) => {
        //validations
        
    
    try{
        
        if(fs.existsSync(addressJProduct)){
            
            let products= await this.#read();
            let  id = products[products.length-1].id+1;
            
            product= {
                id,
                ...product
            }

            products.push(product);

            
            // now write in a function
            this.#write(products);
            return{status:"success", message: `Product  Created`};

        }else{
            // product.id=1;
            product ={
                id:1,
                ...product
            }

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
        id=parseInt(id,10);
        if (fs.existsSync(addressJProduct)) {
            let products = await this.#read();
            let product = products.find(product => product.id === id)
            if (product) return {status: "success", message: product}
            return {status: "error", message: "Product not found"}
        } else (err)=>{
            return {status: "error", message: err.message}
        }
    }


    getAll= async () => {
        if (fs.existsSync(addressJProduct)) {
            let products= await this.#read();
            return {status: "success", message: products}
        } else (err)=>{
            return {status: "error", message: err.message}
        }
    }

    updateById= async (id, product) => {
        if (!id) return {status: "error", message: "Id required"}
        id=parseInt(id, 10);
        try{
            if (fs.existsSync(addressJProduct)) {
                let products = await this.#read();
                let elementIndex = products.findIndex((prod=> prod.id===id));
                    if (elementIndex!==-1){
                        //product.id=id;
                        product= {
                            id,
                            ...product
                        }

                        products[elementIndex]=product;
                        await this.#write(products);
                        return await this.getById(id);
                    }

            }
        }catch(err){
            return{status:"error", message: err.message}
        }

    }

    deleteById = async (id) => {
        //Validation
        if (!id) return {status: "error", message: "Id required"}
        id=parseInt(id, 10);
        if (fs.existsSync(addressJProduct)) {
            let products = await this.#read();
            
            let newProducts = products.filter(product => product.id !== id)
            
            this.#write(newProducts);
            return {status: "success", message: "Product deleted!"}
        } else {
            return {status: "error", message: err.message}
        }
    }

    deleteAll = async () => {
        if (fs.existsSync(addressJProduct)) {
            
            this.#write([]);
            //await fs.promises.writeFile(addressJProduct, JSON.stringify([],null,2))
            
            return {status: "success", message: "Products deleted!"}
        } else {
            return {status: "error", message: err.message}
        }
    }




}

module.exports = Contenedor;