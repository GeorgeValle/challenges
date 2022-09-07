const express = require('express');
const router = express.Router();

const Contenedor = require('../Contenedor');
const container = new Contenedor();


// router.get('/', (req, res)=>{
//     res.send("hola");
// });



//return all products
router.get('/api/products', (req, res) => {
    container.getAll()
        .then((products)=>res.send(products))
    }
)

//returns a product by ID
router.get('/api/products/:id', (req, res) => {
    
    let index =container.validationsID(req.params.id);
    container.getById(index).then((product)=>res.send(product));
    
    
    }
)

//recive and save a product by its ID
router.post('/api/products', (req, res) => {

        

        container.save(product).then(result=>res.send(result));
    }
)
//recive and update a product by id
router.put('/api/products/:id', (req, res) => {
    let index =container.validationsID(req.params.id);
    //tomar el req
    container.updateById(index, req.body).then(result=>res.send(result));


    }
)

//recive and delete a product by its ID
router.delete('/api/products/:id', (req, res) => {
    }
)


module.exports = router;