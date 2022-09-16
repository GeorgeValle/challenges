const express = require('express');
const app= express();


const handlebars = require('express-handlebars');



const productsRouter = require('./routes/Products');

const server =app.listen(8080,() => console.log('listening on port 8080'));

//show error in the connection server
server.on('error', error => console.log(`error in server: ${error} `));


app.use(express.json());
app.use(express.urlencoded({extended:true}))
//app.use(express.static('public'));

//route to productos
app.use('/productos', productsRouter);

// Handlebars config
// const hbs = handlebars.create({
//     extname: 'hbs',
//     defaultLayout: 'main',
//     layoutsDir: __dirname + '/views/layouts/',
// })

app.engine('handlebars', handlebars.engine)


app.set('view engine', 'handlebars')
app.set('views', 'views')


// Endpoints
app.get('/', (req, res) => {
    res.render('form')
})