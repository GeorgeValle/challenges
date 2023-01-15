//Dotenv config
import dotenv from 'dotenv';
dotenv.config();

//server Express
import express from 'express';


//import of passport
import passport from 'passport';
import { registerStrategy, loginStrategy } from "./strategies/local";

import session from 'express-session';
//import MongoStore
import connection from './loaders/connection'
import MongoStore from 'connect-mongo';
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

//import routes
import {productRouter} from './routes/Productsrouter.js';
import {cartRouter} from './routes/Cartsrouter.js';

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
        ttl: 120
    }),
        key: 'user_sid',
        secret: 'library',
        resave:false,
        saveUninitialized: false,
        // cookie:{
        //     maxAge: 60000
        // }
}))


//passport initialization
passport.use('register', registerStrategy)
passport.use('login', loginStrategy)

app.use(passport.initialize())
app.use(passport.session())


//routes to books and carts
app.use('/api/productos',productRouter);
app.use('/api/carrito',cartRouter);

app.use((req, res) => {
    res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
});






export default app;