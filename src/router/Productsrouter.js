import express from 'express';

const router=express.Router();

//casting class book
import {Book} from'../controllers/ManagerBook.js';
const book = new Book();

let isAdmin=true;

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
    if(isAdmin) {
    let create = await book.save(req.body)
    res.send(create);
    }else{res.status(404).send({error: -1, description: `route ${req.baseUrl}${req.url} method ${req.method} not authorized`});}
})

//update by identifier
router.put('/:id', async(req, res) => {
    if(isAdmin) {
    let update = await book.updateById(req.params.id, req.body);
    res.send(update);
    }else{res.status(404).send({error: -1, description: `route ${req.baseUrl}${req.url} method ${req.method} not authorized`});}
})

//delete by identifier
router.delete('/:id', async(req, res) => {
    if(isAdmin) {
    let result = await book.deleteById(req.params.id);
    res.send(result);
    }else{res.status(404).send({error: -1, description: `route ${req.baseUrl}${req.url} method ${req.method} not authorized`});}
})

const productRouter = router;
export {productRouter};