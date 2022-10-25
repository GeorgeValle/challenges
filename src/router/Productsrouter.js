import {Router} from 'express';


const routes= Router();

//casting class book
import book from'../controllers/ManagerBook.js';
//import book from'../controllers/ManagerBookFire.js';
//dynamic import:
//const book = await import('../controllers/ManagerBook.js');
//book.default();


//let isAdmin=true;

//route the test server
routes.get('/health', (req, res) => {
    return res.status(200).json({ message: 'Server is on... '})
})

//create a new instance of the managerBook
routes.post('/products',book.save)

//get all books
routes.get('/products', book.getAll)

//get a book by identifier
routes.get('/products/:id', book.getById)

//update by identifier
routes.put('/products/:id', book.updateById)

//delete by identifier
routes.delete('/products/:id', book.deleteById)

const productRouter = routes;
export {productRouter};