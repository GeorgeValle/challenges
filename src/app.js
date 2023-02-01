//Dotenv config 
// const dotenv = require('dotenv');
// dotenv.config({path: './'});
const dotenv= require ('dotenv');
dotenv.config();

require ('./loaders/connection');

//Cluster
const cluster = require('cluster');
const {infoRouter, randomRouter, sessionRouter} = require('./routes')

//CPUs 
// const processor_count = require('os').cpus().length;


// Yargs
// const yargs = require('yargs')
// const { hideBin } = require('yargs/helpers')
// const argv = yargs(hideBin(process.argv)).argv
// const port = argv.port || 8080
// const mode = argv.mode || 'fork'
// end of yargs

//configuration of port whit fork o cluster mode
const PORT = parseInt(process.argv[2]) || 8080
const modoCluster = process.argv[3] == 'CLUSTER'

//server Express
const express = require('express');
const session= require('express-session');

const {engine} = require('express-handlebars');

//star server Express
const app = express();


//Compression
const compression = require('compression');


if (modoCluster && cluster.isPrimary) {
    const numCPUs = cpus().length

    console.log(`Número de procesadores: ${numCPUs}`)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
} else {


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

//routes

// const productRouter = require('./routes/product.router');
// const chatRouter = require('./routes/chat.router');
// const infoRouter = require('./routes/info.router');
// const randomRouter = require('./routes/random.router');
//path route session
// const sessionRouter = require('./routes/session.router')

    
//object knex for db sqlite


const server = app.listen(PORT, async ()=>{
    console.log(`listening on port ${PORT}`)
    console.log(`PID WORKER ${process.pid}`)
    //table whit MySQl
//Table whit sqlLite

})

server.on('error', error => console.log(`error in server: ${error} `));

// class chat


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
app.engine('handlebars', engine())
// app.set('views', './src/views')
app.set('views', './src/views') 
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

//path to routes before
// app.use('/products', productRouter)
// app.use('/chat', chatRouter)
// app.use('/session',sessionRouter)
// app.use('/info', infoRouter)
// app.use('/random', randomRouter);

//path routes now
infoRouter(app)
randomRouter(app)
sessionRouter(app)

//event connection


}

