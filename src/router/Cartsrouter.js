import express from 'express';

const router=express.Router();

//********************************************** */
//below, you can configure the type of storage

import cart from '../controllers/ManagerCart.js';
//import cart from'../controllers/ManagerBookFire.js';
//dynamic import:
//const book = await import('../controllers/ManagerBook.js');
//book.default();


//create a new instance of the managerCart, Important!: only put id of product book
router.post('/products', cart.save)

//insert a new product in a cart
router.post('/:id/productos/:id_prod', cart.updateById)

//get a Cart by identifier
router.get('/:id', cart.getById)

//delete a Cart by identifier
router.delete('/:id', cart.deleteCart)

//delete product by identifier
router.delete('/:id/productos/:id_prod', cart.deleteById)

const cartRouter = router
export {cartRouter}