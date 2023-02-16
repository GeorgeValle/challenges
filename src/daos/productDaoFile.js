const __dirname = require ("../utils/patches");
const fs = require ('fs');

module.exports = class UserDaoFile {
    constructor() {
        this.path = __dirname + '/files/users.json'
        this.#init()
    }

    #init = async () => {
        if (!fs.existsSync(this.path)) await fs.promises.writeFile(this.path, JSON.stringify([]))
    }

    #readFile = async() => {
        let data = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(data)
    }

    #write=async(products)=>{
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(products,null,2))
        }catch(err){console.error(err)}
    }


    getAll = async() => {
        if(fs.existsSync(this.path)){
            return await this.#readFile()
        }
        else{return {message:"not exist"}}
    }

    save = async(product) => {
        try {
            let products = await this.#readFile()
            if (products.length===0) product.id = 1
            else product.id = products[products.length-1].id+1
            products.push(product)
            await this.writeFile(products) //fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
            return product
        } catch (err) {
            console.log('No se puede leer el archivo')
        }
    }

    getById=async(id)=>{
        //Validation
        try{
        if(!id)return{status: "error",message: "Id required"}
        if(fs.existsSync(this.path)){
            let products=await this.#readFile();
            let product=products.find(product=>product.id===id)
            if(product)return product
            return{status: "error", message: "Product not found"}
        }else{
            return{status: "error", message: "Product list empty"}
        }
    }
    catch(err){ return{status: "Error", message: err.message}}
    }

    deleteById=async(id)=>{
        //Validation
        if(!id)return{status: "error",message: "Id required"}
        if(fs.existsSync(this.path)){
            let products=await this.#readFile();
            
            let newProducts=products.filter(product=>product.id!==id)
            
            this.#write(newProducts);
            return{status: "success",message: "Product deleted!"}
        }else{
            return{status: "error",message: err.message}
        }
    }


    deleteAll=async()=>{
        if(fs.existsSync(this.path)){
            
            this.#write([]);
            //await fs.promises.writeFile(addressJProduct, JSON.stringify([],null,2))
            
            return{status: "success",message: "Products deleted!"}
        }else{
            return{status: "error",message: err.message}
        }
    }






}