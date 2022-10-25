import express from 'express';

const router=express.Router();

import {Cart} from '../controllers/ManagerCart.js';

const cart = new Cart();

//create a new instance of the managerCart, Important!: only put id of product book
router.post('/', async (req, res) => {
    let create = await cart.save()
    res.send(create);

})

router.post('/:id/productos/:id_prod', async(req, res) => {

    let product= await cart.getProduct(req.params.id_prod);
    
    let update = await cart.updateById(req.params.id,product);
    res.send(update);
    
})

//get a Cart by identifier
router.get('/:id', async(req, res) => {
    
    let products= await cart.getById(req.params.id);
    res.send(products);
})

//delete a Cart by identifier
router.delete('/:id', async(req, res) => {
    
    let result = await cart.deleteCart(req.params.id);
    res.send(result);
    
})

//delete by identifier
router.delete('/:id/productos/:id_prod', async(req, res) => {
    
    let result = await cart.deleteById(req.params.id, req.params.id_prod);
    res.send(result);
    
})

const cartRouter = router
export {cartRouter}