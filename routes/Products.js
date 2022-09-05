const express = require('express');
const router = express.Router();




router.get('/', (req, res)=>{
    res.send("hola");
});

//return all products
router.get('/api/products', (req, res) => {
    res.send({products})
    }
)

//returns a product by ID
router.get('/api/products/:id', (req, res) => {
    
    let index =req.params.id;

    if(isNaN(index)) return res.status(400).send({error:"not existence Id. Please, enter only numbers"});
    if(index<0)return res.status(400).send({error:"not existence Id. Please, enter Id above 0"});
    if(index>products.length+1) return res.status(400).send({error:"out of range"});
    res.send({product: products[index]});
    }
)

//recive and update a product by its ID
router.post('/api/products', (req, res) => {
    }
)

router.put('/api/products/:id', (req, res) => {
    }
)

router.delete('/api/products/:id', (req, res) => {
    }
)


module.exports = router;