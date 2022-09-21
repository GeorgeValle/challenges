const express = require('express');
const app= express();


const productsRouter = require('./routes/Products');

const server =app.listen(8080,() => console.log('listening on port 8080'));

//show error in the connection server
server.on('error', error => console.log(`error in server: ${error} `));


app.use(express.json());
app.use(express.urlencoded({extended:true}))
// app.use(express.static('public'));

//route to productos
app.use('/products', productsRouter);

//ejs Config
app.set('views', './views')
app.set('view engine', 'pug')


// Endpoints
app.get('/', (req, res) => {
    res.render('create-product')
    }
)

