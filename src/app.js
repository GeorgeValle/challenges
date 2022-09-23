//server Express
const express = require('express');

//configuration web socket 
const {Server}= require('socket-io');
const handlebars = require('express-handlebars');

const productRouter = require('./routes/product.router');
const chatRouter = require('./routes/chat.router');

let products= require('./models/product.models');

// class
const Manager = require('./controllers/chat.manager');
const manager = new Manager();

const app = express();
const PORT = process.env.PORT||8080;

const server = app.listen(PORT,()=> console.log(`listening on port ${PORT}`))
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended:true }));


app.use('/content', express.static('./src/public'))


//views client side
app.engine('handlebars', handlebars.engine())
// app.set('views', './src/views')
app.set('views', __dirname+'/views') 
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('create-product')
})

//path to routes
app.use('/products', productRouter)
app.use('/chat', chatRouter)

//event connection
io.on('connection', socket => {
    console.log(`Client ${socket.id} connected...`)
    //send product list 
    socket.emit('history', products)
    manager.findAll().then(result => socket.emit('chatHistory', result))
    socket.on('products', data => {
        io.emit('history', data)
    })
    socket.on('chat', data => {
        io.emit('chatHistory', data)
    })
})

