const express = require('express');
const app = express();

const server = app.listen(8080, () => {
        console.log('server up')
});

//para ver los posibles errores al conectar con el server
server.on('error', error => console.log(`server error ${error}`));

const Contenedor = require('./Contenedor.js')
const container = new Contenedor()



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
							color: red;
						}
				</style>
            </head>
            <body>
				<h1>Bienvenido al Desaf&#237;o 3 &quot;Server Express&quot;!</h1>
				<h2>Parte 2</h2>
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

app.get('/products', (req, res) => {

        container.getAll()
        .then((products)=>res.send(products))
        

});

app.get('/randomProducts', (req, res) => {

		container
		.getAll()
		.then((prod) =>
			res.send(prod.message[Math.floor(Math.random() * prod.message.length)])
		);
        
})