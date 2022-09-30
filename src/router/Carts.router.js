const express = require('express');

const router=express.Router();

const Cart=require('../controllers/ManagerCart');
const cart = new Cart();

//create a new instance of the managerCart, Important!: only put id of product book
router.get('/', async (req, res) => {
    let create = await cart.save()
    res.send(create);

})

router.post('/:id/productos', async(req, res) => {
    
    let update = await cart.updateById(req.params.id)
    res.send(update);
    
})

//get a Cart by identifier
router.get('/:id', async(req, res) => {
    let products= await cart.getById(req.params.id);
    res.send(products);
})

//delete by identifier
router.delete('/:id/productos/:id_prod', async(req, res) => {
    
    let result = await cart.deleteById(req.params.id, req.params.id_prod);
    res.send(result);
    
})



module.exports = router;