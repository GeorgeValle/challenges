import express, { json } from 'express';
const app= express();

const Contenedor = require('./Contenedor.js')
const container = new Contenedor()

const productsRouter = require('./routes/Products');

const server =app.listen(8080,() => console.log('listening on port 8080'));

//show error in the server conection
server.on('error', error => console.log(`error in server: ${error} `));

app.use(json());


app.get('/', (req, res) => {

    `<html>
        <head>
        </head>
        <body>
            <h2>Producto<h2>
        </body>
    </html>`
}

);

//return all products
app.get('/api/products', (req, res) => {
    res.send({products})
    }
)

//returns a product by ID
app.get('/api/products/:id', (req, res) => {
    
}
);

//recive and update a product by its ID
app.post('/api/products', (req, res) => {
    }
);

app.put('/api/products/:id', (req, res) => {
    }
);

app.delete('/api/products/:id', (req, res) => {
    }
);