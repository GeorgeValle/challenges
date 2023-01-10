import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import {productRouter} from './router/Productsrouter.js';
import {cartRouter} from './router/Cartsrouter.js';

const PORT = process.env.PORT||8080;

const server = app.listen(PORT,()=> console.log(`listening on ${PORT}`));

server.on('error', error => console.log(`error in server: ${error} `));

//middleware of json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes to books and carts
app.use('/api/productos',productRouter);
app.use('/api/carrito',cartRouter);

app.use((req, res) => {
    res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
});


export default app;