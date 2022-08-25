//call to filesystem

const fs=require('fs');
// save the path to json file
const addressJProduct='./products.txt';

//create teh new class Container
class Contenedor{
    save= async (product) => {
        //validations
        if(!product.title||!product.price||!product.thumbnail) return{status:"error", message: "missing product"}
    
    try{
        if(fs.existsSync(addressJProduct)){
            let data= await fs.promises.readFile(addressJProduct,'utf-8')
            let  products = JSON.parse(data);
            let  id = products[products.length-1].id+1;
            product.id=id;
            products.push(product);
            await fs.promises.writeFile(addressJProduct, JSON.stringify(products,null,2))
            return{status:"success", message: `Product ${id} Created`};

        }else{
            product.id=1
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
            let data = await fs.promises.readFile(addressJProduct, 'utf-8')
            let products = JSON.parse(data)
            let product = products.find(product => product.id === id)
            if (product) return {status: "succes", message: product}
            return {status: "error", message: "Product not found"}
        } else {
            return {status: "error", message: err.message}
        }
    }

    getAll= async () => {
        if (fs.existsSync(addressJProduct)) {
            let data = await fs.promises.readFile(addressJProduct, 'utf-8')
            let products = JSON.parse(data)
            return {status: "success", message: products}
        } else {
            return {status: "error", message: err.message}
        }
    }

    deleteById = async (id) => {
        //Validation
        if (!id) return {status: "error", message: "Id required"}
        if (fs.existsSync(addressJProduct)) {
            let data = await fs.promises.readFile(addressJProduct, 'utf-8')
            let products = JSON.parse(data)
            let newProducts = products.filter(product => product.id !== id)
            await fs.promises.writeFile(addressJProduct, JSON.stringify(newProducts, null, 2))
            return {status: "success", message: "Product deleted!"}
        } else {
            return {status: "error", message: err.message}
        }
    }

    deleteAll = async () => {
        if (fs.existsSync(addressJProduct)) {
            await fs.promises.writeFile(addressJProduct, JSON.stringify([],null,2))
            
            return {status: "success", message: "Products deleted!"}
        } else {
            return {status: "error", message: err.message}
        }
    }
}

module.exports = Contenedor;

