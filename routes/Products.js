const express = require('express');
const router = express.Router();

const Contenedor = require('../Contenedor');
const container = new Contenedor();


//return all products
router.get('/', (req, res) => {
    container.getAll()
        .then((products)=>{ 
            res.render('products', { products })
        })
        .catch(error => { res.status(500).json(error) })
    }
)



//receives and save a product by its ID
router.post('/', (req, res) => {

    if (!req.body.title||!req.body.price||!req.body.thumbnail) return res.status(400).json({ error: 'title, price and thumbnail are required' })
        let product= req.body;
        product.price=parseFloat(product.price);
        container.save(req.body)
        .then(data => {
            container.getById(data)
                .then(prod => { res.redirect('/api/productos') })
                .catch(error => { res.status(500).json(error) })
        })
        .catch(error => { res.status(500).json(error) })
    }
    
)



module.exports = router;