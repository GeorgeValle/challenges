const productFactory = require ("../daos/productFactory")

module.exports = class ProductsService {
    constructor() {
        // this.usersDao = new UsersDaoArray()
        // this.usersDao = new UserDaoFile()
        this.productsDao
        this.init()
    }

    init = async() => {
        this.productsDao = await productFactory.getPersistence()
    }

    getProducts = async () => {
        return await this.productsDao.getAll()
    }

    addProduct = async(product) => {
        return await this.productsDao.save(product)
    }
}