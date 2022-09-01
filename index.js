const express = require('express');
const app = express();

const server = app.listen(8080, () => {
    console.log('server up')
});

//para ver los posibles errores al conectar con el server
server.on('error', error => console.log(`server error ${error}`));

let productos= [
    {
        "title": "Escuadra",
        "price": 123.45,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        "id": 1
    },
    {
        "title": "Calculadora",
        "price": 234.56,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        "id": 2
    },
    {
        "title": "Globo Terráqueo",
        "price": 345.67,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        "id": 3
    }
    ];

//se genera una ruta
//
app.get('/products', (req, res) => {res.send({status: "success", message: productos});
});

app.get('/randomProducts', (req, res) => {
    
    let aleatorio = productos[Math.floor(Math.random()*productos.length)];
    res.send({status: "success", message: aleatorio});
        
})


