const express = require('express');
const router = express.Router();

const Contenedor = require('../Contenedor');
const container = new Contenedor();


//return all products
router.get('/', (req, res) => {
    container.getAll()
        .then((products)=>res.send(products))
    }
)

//returns a product by ID
router.get('/:id', (req, res) => {
    
    // let index =container.validationsID(req.params.id);
    //container.getById(index).then((product)=>res.send(product));
    container.getById(req.params.id).then((product)=>res.send(product));
    
    
    }
)

//recive and save a product by its ID
router.post('/', (req, res) => {

        container.save(req.body).then(result=>res.send(result));
    }
)
//recive and update a product by id
router.put('/:id',  (req, res) => {

    if (!req.body.title||!req.body.price||!req.body.thumbnail) return res.send({error: 'data is requiered'});
    //let index =  container.validationsID(req.params.id);
    //container.updateById(index, req.body).then(result=>res.send(result));
    container.updateById(req.params.id, req.body).then(result=>res.send(result));


    }
)

//recive and delete a product by its ID
router.delete('/:id', (req, res) => {
        let result = container.deleteById(req.params.id);
        res.send(result)

    }
)


module.exports = router;