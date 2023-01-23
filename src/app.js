//Dotenv config 
// const dotenv = require('dotenv');
// dotenv.config({path: './'});
const dotenv= require ('dotenv');
dotenv.config();

const connection= require ('./loaders/connection');

//Cluster
const cluster = require('cluster');

//CPUs 
const processor_count = require('os').cpus().length;

// Yargs
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const port = argv.port || 8080
const mode = argv.mode || 'fork'
// end of yargs


//server Express
const express = require('express');
const session= require('express-session');

//star server Express
const app = express();


//Compression
const compression = require('compression');

//mongo
const MongoStore = require('connect-mongo');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

const passport = require('passport');

const { initializePassport }= require ("./strategies/local");


app.use(compression({
    //level por default
    level: 6
}))

//configuration web socket 
const {Server}= require('socket.io');

const handlebars = require('express-handlebars');

//routes
const productRouter = require('./routes/product.router');
const chatRouter = require('./routes/chat.router');
const infoRouter = require('./routes/info.router');
const randomRouter = require('./routes/random.router');
//path route session
const sessionRouter = require('./routes/session.router')

const createTable1 = require('./options/createTable1');
const createTable2 = require('./options/createTable2');    

let productsList= require('./models/product.models');

//object knex for db sqlite
const sqlite = require('./options/sqlite.config')



// Server Cluster / Fork
if (cluster.isPrimary) {
    console.log(`Cantidad de núcleos disponibles: ${processor_count}`)
    console.log(`Hilo principal en el proceso PID: ${process.pid}`)
    // Cluster
    if (mode === 'cluster') {
        for (let i = 0; i < processor_count; i++) {
            cluster.fork()
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} terminó.`)
            console.log('Iniciando otro worker...')
            cluster.fork()
        })
    } else {
        cluster.fork()
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} terminó.`)
            console.log('Iniciando otro worker...')
            cluster.fork()
        })
    }
} else {


//const PORT = process.env.PORT||8080;

const tbl_Products ="products";
const tbl_chats = "chats";

const server = app.listen(port, async ()=>{
    console.log(`listening on port ${port}`)
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
        dbName: 'auth-local',
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

//middleware Compression
app.use(compression())

app.use('/content', express.static('./src/public'))



//views client side
app.engine('handlebars', handlebars.engine())
// app.set('views', './src/views')
app.set('views', __dirname+'/views') 
app.set('view engine', 'handlebars')


//passport initialization
// passport.use('register', registerStrategy)
// passport.use('login', loginStrategy)

initializePassport()

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

//for message in inexistent routes
app.use((req, res) => {
    res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
});

app.use((error, req , res, next)=>{
	res.status(400).json({
		status: 'error',
		message: error.message
	})
})

//path to routes
app.use('/products', productRouter)
app.use('/chat', chatRouter)
app.use('/session',sessionRouter)
app.use('/info', infoRouter)
app.use('/random', randomRouter);

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
}
