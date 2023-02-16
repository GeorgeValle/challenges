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

module.exports =  {
    saveProduct, getProducts
}