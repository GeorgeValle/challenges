//Dotenv config 
// const dotenv = require('dotenv');
// dotenv.config({path: './'});
const dotenv= require ('dotenv');
dotenv.config();

const connection= require ('./loaders/connection');

//server Express
const express = require('express');
const session= require('express-session');
const FileStore = require('session-file-store');

const store = FileStore(session);



//configuration web socket 
const {Server}= require('socket.io');

const handlebars = require('express-handlebars');

const productRouter = require('./routes/product.router');
const chatRouter = require('./routes/chat.router');

const createTable1 = require('./options/createTable1');
const createTable2 = require('./options/createTable2');    

let productsList= require('./models/product.models');
//object knex for db sqlite
const sqlite = require('./options/sqlite.config')



const app = express();
const PORT = process.env.PORT||8080;

const tbl_Products ="products";
const tbl_chats = "chats";

const server = app.listen(PORT, async ()=>{
    console.log(`listening on port ${PORT}`)
    //table whit MySQl
try{
    await createTable1(tbl_Products)
    console.log('Databases was created!')
}catch {
    console.log('Error in databases tables creation')
}
//Table whit sqlLite
try{
    await createTable2(tbl_chats)
    console.log('Databases was created!')
}catch {
    console.log('Error in databases tables creation')
}
})


let baseSession = session({
    store: MongoStore.create({ mongoUrl: process.env.DB_ATLAS }),
    secret: 'c0d3r',
    resave: false,
    saveUninitialized: false
})

// class chat
const Manager = require('./controllers/chat.manager');
const manager = new Manager(sqlite,tbl_chats);

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//session
app.use(session({
    store:new Storage({
        path: './session',
        ttl:120 //time to live
    })
}))

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
    socket.emit('history', productsList)
    manager.findAll().then(result => socket.emit('chatHistory', result))
    socket.on('products', data => {
        io.emit('history', data)
    })
    socket.on('chat', data => {
        io.emit('chatHistory', data)
    })
})

