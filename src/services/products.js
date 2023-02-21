class Products {
    constructor() {
        this.products = []
    }
    getProducts = () =>{
        return this.products
    }
    getById = (id) =>{ 
        
        let index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
            return this.products[index]
        } else {
            throw new Error('Product not modified by ID')
        }
        // for (let i=0; i<this.products.length; i++) {
        //     if (this.products[i].id === parseInt(id)) return this.products[i]
        // }
        // return {}
        //return this.products.find(p=> p.id === parseInt(id))

    }
    createProduct = (data) => {
        if (this.products.length === 0) data.id = 1
        else data.id = this.products[this.products.length-1].id+1
        this.products.push(data)
        return data
    }
    modifyProduct = (data) => {
        let index = this.products.findIndex(p => p.id === data.id)
        if (index !== -1) {
            this.products[index] = data
            return this.products[index]
        } else {
            throw new Error('Product not modified by ID')
        }
    }
    deleteAllProducts = () => {
        this.products = []
        return this.products
    }
    deleteOneProduct = (id) => {
        this.products = this.products.filter(p => p.id !== id)
        return this.products
    }
}

const product = new Products()
export default product