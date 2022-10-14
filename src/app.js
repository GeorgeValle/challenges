const express = require ('express');
const app = express();

const productsRouter = require('./router/Products.router');
const cartsRouter = require('./router/Carts.router');

const PORT = process.env.PORT||8080;

const server = app.listen(PORT,()=> console.log(`listening on ${PORT}`));

server.on('error', error => console.log(`error in server: ${error} `));

//middleware of json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





//routes to books and carts
app.use('/api/productos',productsRouter);
app.use('/api/carrito',cartsRouter);

app.use((req, res) => {
    res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
});
