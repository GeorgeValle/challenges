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

    getAll = async() => {
        return await this.#readFile()
    }

    save = async(product) => {
        try {
            let products = await this.#readFile()
            if (products.length===0) product.id = 1
            else product.id = products[products.length-1].id+1
            products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
            return product
        } catch (err) {
            console.log('No se puede leer el archivo')
        }
    }
}