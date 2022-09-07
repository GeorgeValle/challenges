const express = require('express');
const app= express();

const Contenedor = require('./Contenedor.js')
const container = new Contenedor()

const productsRouter = require('./routes/Products');

const server =app.listen(8080,() => console.log('listening on port 8080'));

//show error in the server conection
server.on('error', error => console.log(`error in server: ${error} `));




// app.get('/', (req, res) => {

    

// );
app.use(express.json());
app.use(express.static('public'));
//return all products
app.use.get('/api/products', productsRouter);

//returns a product by ID
app.use.get('/api/products/:id', productsRouter);

//recive and save a product by its ID
app.use.post('/api/products', productsRouter);

//recive and update a product by id
app.use.put('/api/products/:id', productsRouter);

//recive and delete a product by its ID
app.use.delete('/api/products/:id', productsRouter);