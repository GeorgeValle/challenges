const express = require('express');
const app = express();

const server = app.listen(8080, () => {
    console.log('server up')
});

//para ver los posibles errores al conectar con el server
server.on('error', error => console.log(`server error ${error}`));

const Contenedor = require('./Contenedor.js')
const container = new Contenedor()

//se genera una ruta
//
app.get('/products', (req, res) => {
    
        container.getAll()
        .then((products)=>res.send(products))
});

app.get('/randomProducts', (req, res) => {
    
        container.getRandom()
        .then((products)=>res.send(products))
        .catch(error=>console.error(`rechazada: ${error}`))
        
})