//Dotenv config
import dotenv from 'dotenv';
dotenv.config();

//server Express
import express from 'express';


//import of passport
import passport from 'passport';
import { initializePassport } from "./strategies/local.js";


import session from 'express-session';
//import MongoStore
import './loaders/connection.js';
import MongoStore from 'connect-mongo';
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

//import handlebars
import { engine } from 'express-handlebars';

//import routes
import {productRouter} from './routes/ProductsRouter.js';
import {cartRouter} from './routes/CartsRouter.js';
import {sessionRouter} from './routes/SessionRouter.js';

//configure express
const app = express();
const PORT = process.env.PORT||8080;

const server = app.listen(PORT,()=> console.log(`listening on ${PORT}`));

server.on('error', error => console.log(`error in server: ${error} `));

//middleware of json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Mongo configuration
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: process.env.DB_ATLAS,
        mongoOptions: advancedOptions,
        dbName: 'passport-auth',
        collectionName: 'session',
        ttl: 1200
    }),
        key: 'user_sid',
        secret: 'library',
        resave:false,
        saveUninitialized: false,
        // cookie:{
        //     maxAge: 60000
        // }
}))


app.use('/content', express.static('./src/public'))

//handlebars configuration
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

//root route handlebars
app.get('/', 
    (req, res) => res.redirect('/session')   
)

// app.get('/create',(req, res)=>{
//     if(req.isAuthenticated()){
//         res.render('dashboard',{
//             user: req.user.name, avatar: req.user.avatar
//             })

//     }
//     else{ res.redirect('/')}
// })

app.get('/home',(req, res)=>{
    if(req.isAuthenticated()){

        res.redirect('/session/create')

    }
    else{ res.redirect('/')}
})

//routes to books and carts
app.use('/productos',productRouter);
app.use('/carrito',cartRouter);
app.use('/session',sessionRouter);

app.use((req, res) => {
    res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
});

app.use((error, req , res, next)=>{
	res.status(400).json({
		status: 'error',
		message: error.message
	})
})





export default app;