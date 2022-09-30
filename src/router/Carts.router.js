const express = require('express');

const router=express.Router();

const Cart=require('../controllers/ManagerCart');
const cart = new Cart();

//create a new instance of the managerCart, Important!: only put id of product book
router.get('/', async (req, res) => {
    
})

router.post('/:id', async(req, res) => {
    
    let create = await cart.save(req.params.id)
    res.send(create);
    
})

//get a Cart by identifier
router.get('/:id', async(req, res) => {
    let products= await cart.getById(req.params.id);
    res.send(products);
})



module.exports = router;