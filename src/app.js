//Dotenv config 
// const dotenv = require('dotenv');
// dotenv.config({path: './'});
const dotenv= require ('dotenv');
dotenv.config();

const connection= require ('./loaders/connection');

//server Express
const express = require('express');
const session= require('express-session');
// const FileStore = require('session-file-store');

// const store = FileStore(session);

const MongoStore = require('connect-mongo');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

const passport = require('passport');

const { registerStrategy, loginStrategy }= require ("./strategies/local");

//configuration web socket 
const {Server}= require('socket.io');

const handlebars = require('express-handlebars');

const productRouter = require('./routes/product.router');
const chatRouter = require('./routes/chat.router');
//path route session
const sessionRouter = require('./routes/session.router')

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


// class chat
const Manager = require('./controllers/chat.manager');
const { application } = require('express');
const manager = new Manager(sqlite,tbl_chats);

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//session
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: process.env.DB_MONGO,//process.env.DB_ATLAS,
        mongoOptions: advancedOptions,
        dbName: 'passport-auth',
        collectionName: 'session',
        ttl: 120
    }),
        key: 'user_sid',
        secret: 'coder',
        resave:false,
        saveUninitialized: false,
        // cookie:{
        //     maxAge: 60000
        // }
}))

app.use('/content', express.static('./src/public'))


//views client side
app.engine('handlebars', handlebars.engine())
// app.set('views', './src/views')
app.set('views', __dirname+'/views') 
app.set('view engine', 'handlebars')

// app.get('/', (req, res) => {
//     res.render('create-product')
// })


passport.use('register', registerStrategy)
passport.use('login', loginStrategy)

app.use(passport.initialize())
app.use(passport.session())


app.get('/', 
    (req, res) => res.redirect('/session')   
)


app.get('/create',(req, res)=>{
    if(req.isAuthenticated()){
        res.render('create-product',{
            user: req.user.username, 
            })

    }
    else{ res.redirect('/')}
})

// app.get('/logout', (req, res) => {
//     res.render('logout')
// })


//path to routes
app.use('/products', productRouter)
app.use('/chat', chatRouter)
app.use('/session',sessionRouter)

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

