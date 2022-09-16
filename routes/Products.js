const express = require('express');
const router = express.Router();

const Contenedor = require('../Contenedor');
const container = new Contenedor();


//return all products
router.get('/', (req, res) => {
    // container.getAll()
    //     .then((products)=>{ 
    //         res.render('products', { products })
    let result= container.getAll()
    res.render('products', {products:result})
        })
        
    




//receives and save a product by its ID
router.post('/', (req, res) => {

    if (!req.body.title||!req.body.price||!req.body.thumbnail) return res.status(400).json({ error: 'title, price and thumbnail are required' })
        let product= req.body;
        product.price=parseFloat(product.price);
        container.save(req.body)
        res.redirect('/productos');
    }
    
)



module.exports = router;