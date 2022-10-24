import {Router} from 'express';


const routes= Router();

//casting class book
import Book from'../controllers/ManagerBook.js';
// const book = new Book();

let isAdmin=true;

routes.get('/health', (req, res) => {
    return res.status(200).json({ message: 'Server is on... '})
})



//get all books

routes.post('/products',Book.save)

routes.get('/products', Book.getAll)
// router.get('/', async (req, res) => {
//     let products =await book.getAll();
    
//     res.send(products);
// })

//get a book by identifier
routes.get('/products/:id', Book.getById)

// router.get('/:id', async(req, res) => {
//     let product= await book.getById(req.params.id);
//     res.send(product);
// })

//create a new instance of the managerBook


// router.post('/', async(req, res) => {
//     if(isAdmin) {
//     let create = await book.save(req.body)
//     res.send(create);
//     }else{res.status(404).send({error: -1, description: `route ${req.baseUrl}${req.url} method ${req.method} not authorized`});}
// })

//update by identifier

routes.put('/products/:id', Book.updateById)

// router.put('/:id', async(req, res) => {
//     if(isAdmin) {
//     let update = await book.updateById(req.params.id, req.body);
//     res.send(update);
//     }else{res.status(404).send({error: -1, description: `route ${req.baseUrl}${req.url} method ${req.method} not authorized`});}
// })

//delete by identifier

routes.delete('/products/:id', Book.deleteById)

// router.delete('/:id', async(req, res) => {
//     if(isAdmin) {
//     let result = await book.deleteById(req.params.id);
//     res.send(result);
//     }else{res.status(404).send({error: -1, description: `route ${req.baseUrl}${req.url} method ${req.method} not authorized`});}
// })

const productRouter = routes;
export {productRouter};