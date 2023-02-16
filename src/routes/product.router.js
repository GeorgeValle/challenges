const express = require ("express")
const productController = require ("../controllers/productController")

const router = express.Router()

router.get('/', productController.getProducts)
router.post('/', productController.saveProduct)
router.get('/id', productController.getProductById)
router.delete('/id', productController.deleteProductById)
router.delete('/all',productController.deleteAllProducts)

module.exports = router