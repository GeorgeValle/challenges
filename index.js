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

//se genera una ruta raiz con links para ingresar a los endpoints
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <style>
                    * {
                        margin: 0;
						box-sizing: border-box;
						}
						h1 {
						color: #3366dd;
						}
                        h2{
                            color: green;
                        }
				</style>
            </head>
            <body>
				<h1>Bienvenido al Desaf&#237;o 3 &quot;Server Express&quot;!</h1>
                <h2>Parte 1</h2>
				<br>
				<p>Este servidor est&#225; pensado para consumirse como API en los siguientes endpoints:</p>
				<ul>
					<li><a href="/products">/products</a></li>
					<li><a href="/randomProducts">/randomProducts</a></li>
				</ul>
			</body>
        </html
            `)

});
//
app.get('/products', (req, res) => {res.send({status: "success", message: productos});
});

app.get('/randomProducts', (req, res) => {
    
    let aleatorio = productos[Math.floor(Math.random()*productos.length)];
    res.send({status: "success", message: aleatorio});
        
})


