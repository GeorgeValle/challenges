const express = require('express');

const router=express.Router();

const Cart=require('../controllers/ManagerCart');
const cart = new Cart();

//create a new instance of the managerBook
router.post('/', async(req, res) => {
    if(isAdmin) {
    let create = await cart.save(req.body)
    res.send(create);
    }else{res.status(404).send({error: -1, description: `route ${req.baseUrl}${req.url} method ${req.method} not authorized`});}
})



module.exports = router;