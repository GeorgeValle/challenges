const express = require('express');

const router=express.Router();

//casting class book
const Book=require('../controllers/ManagerBook');
const book = new Book();

//get all books
router.get('/', async (req, res) => {
    let products =await book.getAll();
    res.send(products);
})

//get a book by identifier
router.get('/:id', async(req, res) => {
    let product= await book.getById(req.params.id);
    res.send(product);
})

//create a new instance of the managerBook
router.post('/', async(req, res) => {
    let create = await book.save(req.body)
    res.send(create);
})

//update by identifier
router.put('/:id', async(req, res) => {
    let update = await book.updateById(req.params.id, req.body);
    res.send(update);
})

//delete by identifier
router.delete('/:id', (req, res) => {
    let result = book.deleteById(req.params.id);
    res.send(result);
})

module.exports = router;