const ProductsService = require ("../services/productService");
const ProductDTO = require ("../dtos/productDTO");

const productService = new ProductsService()

const getProducts = async(req, res) => {
    let result = await productService.getProducts()
    let resultDTO = result.map(product => new ProductDTO(product))
    res.send(resultDTO)
}

const saveProduct = async (req, res) => {
    let product = req.body
    //TODO: Validations...
    let result = await productService.addProduct(product)
    res.send(new ProductDTO(result))
}

const getProductById = async (req, res) => {
    let id = req.params.id
    let result = await productService.getProductById(id)
    res.send(new ProductDTO(result))
}

const deleteProductById = async (req, res) => {
    let id = req.params.id
    let result = await productService.deleteProductById(id)
    res.send(result)
}

const deleteAllProducts = async (req, res) => {
    let result = await productService.deleteAllProducts()
    res.send(result)
}

module.exports =  {
    saveProduct,
    getProducts,
    getProductById,
    deleteProductById,
    deleteAllProducts
}