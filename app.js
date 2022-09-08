const express = require('express');
const app= express();

const productsRouter = require('./routes/Products');

const server =app.listen(8080,() => console.log('listening on port 8080'));

//show error in the server conection
server.on('error', error => console.log(`error in server: ${error} `));


app.use(express.json());
app.use(express.static('public'));
//route to products
app.use('/api/products', productsRouter);

