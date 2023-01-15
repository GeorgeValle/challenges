# Pasos Hechos tercer entrega(spanish) 

## Dependencias
```javascript
"dependencies": {
    "dotenv": "^16.0.3",
  
    
  "express": "^4.18.1",
  
    
  "mongoose": "^6.6.5",
  
    
  "nodemon": "^2.0.20"
  
  
  }
```


## utilización con el storage MongoDB a través del framework Moongoose

### Creación de conexión con Mongoose

en el interior de la carpeta *loaders* se crea un archivo js de conexión llamado *connection.js*
 se importa el dotenv y se configura para usar la key de MongoDB Atlas
```javascript
 import dotenv from 'dotenv';
dotenv.config();
```

Se establece la conexión importando la librería, modularizando la url y el mongoose.connection. Luego se llama a la función mongoose.conect
```javascript
import mongoose, {mongo} from 'mongoose';

const uri= process.env.DB_ATLAS
const ear= mongoose.connection;

mongoose.connect(uri,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(err => {console.log(err)});
```
se configuran los escuchadores de conección a la base de datos y al de captura de errores en el servidor.

```javascript
ear.once('open',_=>{
    console.log(`Database is connected to: `, uri)
})

ear.on('error', err => {console.log(`Type error: ${err}`)});
```

### Configuración de los schemas productos y Carritos dentro de la carpeta models

Schema de productos:
```javascript
import {Schema,model} from 'mongoose';

const productSchema = new Schema({
    name:String,
    price:{
        type: Number,
        default: 0
    },
    stock:{
        type:Number,
        default:0
    },
    description:String,
    code:Number,
    thumbnail:String,

})

export default  model('product', productSchema);
```

[!NOTA] en este caso el script de sqlit
```javascript

```

schema de carritos:
```javascript
import {Schema,model} from 'mongoose';

const cartSchema = new Schema({
    timestamp:{
        type:Date,
        default:Date.now().toLocaleString(),
    },
    products:{ 
        type : Array,
        "default" : []
    },
})

export default model('cart', cartSchema);
```
### creación de los controllers managerBook.js

* In progress

### Configuración de bcryp
* dentro de la carpeta utils, en el archivo bcrypt.js se crea la config.
```javascript
import bcrypt from 'bcrypt';

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValid = (user, password) => bcrypt.compareSync(password, user.password);

export {
    createHash,
    isValid
}

```

## Configuracion de Passport

* dentro de la carpeta strategies, en el archivo localjs. se coloca la config para exportar {registerStrategy, loginStrategy}:

```javascript
import LocalStrategy from 'passport-local';
import passport from 'passport';
import { userModel } from '../models/Users';
import { createHash, isValid } from '../utils/bcrypt';

const registerStrategy = new LocalStrategy(async (email, password,name, address, age, phone, avatar, cb) => {
    try {
        const user = await userModel.findOne({email})
        if(user){ return cb(null, false, {message: 'User already exist'})}

        const hash = createHash(password)
        const newUser = await userModel.create({email, password: hash, name, address, age, phone, avatar})

        console.log(newUser)
        return cb(null, newUser)
    } catch (error) {
        return cb(error)
    }
})

const loginStrategy = new LocalStrategy(async (email, password, cb) => {
    try {
        const user = await userModel.findOne({email})
        if(!user){ return cb(null, false, { message: 'User does not exist' })}

        if(!isValid(user, password)){ return cb(null, false, { message: 'Wrong password' })}
        
        return cb(null, user)
    } catch (error) {
        return cb(error)
    }
})

passport.serializeUser((user, cb) => {
    cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
    userModel.findById(id, cb)
})

export {registerStrategy, loginStrategy};
```
### configuración de passport en app.js
* importación

```javascript
import passport from 'passport';
import { registerStrategy, loginStrategy } from "./strategies/local";
```

* inizialización
```javascript
//passport initialization
passport.use('register', registerStrategy)
passport.use('login', loginStrategy)

app.use(passport.initialize())
app.use(passport.session())

```

## Configuración de Mongo Store
* Configuración en App.js
```javascript
//import MongoStore
//trae el archivo options con la coneción a mongoDB Atlas
import connection from './loaders/connection'

//server Express
import express from 'express';
import session from 'express-session';


import MongoStore from 'connect-mongo';
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
```

* se configura para una sesión
```javascript
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
```
### Configuración de rutas para autentificación

*se configura una ruta que gestiona las autenticaciones
```javascript
//path route session
import sessionRouter from './routes/session.router'

app.use('/session',sessionRouter)
```

* En app, se crea una ruta raíz para derivar a route Session
```javascript
app.get('/', 
    (req, res) => res.redirect('/session')   
)
```
* en Session, ademas de express, se importa passport:

```javascript
import express from 'express';
import route from express.Router();

import passport from "passport";
```


* En Route Session, su ruta raíz fiscaliza si hay sesion activa. si no es así deriva a ruta'login':
```javascript
route.get('/', (req, res) => {
   if (!req.isAuthenticated()) {
       res.redirect('/login')
   }
   else{
       res.redirect('/create')
   }
})
```
* En Route Session, al get '/login' se le pasa isAuthenticated() para verificar si no hay sesión activa para mandar a la vista login, pero si hay sesión deriva a la dirección '/create' que es la del dashborad.

```javascript
route.get('/login', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('login')
    }
    else {
        res.redirect('/create')
    }
})
```


