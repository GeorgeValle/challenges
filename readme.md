# Pasos Hechos en Desafio Process (spanish) 

## Dependencias
```javascript
   "dependencies": {
    "bcrypt": "^5.1.0",
    "connect-mongo": "^4.6.0",
    "cookie": "^0.5.0",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.0.3",
    "express": "^4.18.1",
    "express-handlebars": "^6.0.6",
    "express-session": "^1.17.3",
    "knex": "^2.3.0",
    "mongodb": "^4.11.0",
    "moongose": "^1.0.0",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.20",
    "parser": "^0.1.4",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "session-file-store": "^1.5.0",
    "socket.io": "^4.5.2",
    "sqlite3": "^5.1.2"
  }
```
## Configuración de bcryp

* dentro de la carpeta utils, en el archivo bcrypt.js se crea la config.

```javascript
const bcrypt = require ('bcrypt');

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValid = (user, password) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValid
}
```

## Configuracion de Passport

* dentro de la carpeta strategies, en el archivo localjs. se coloca la config part exportar {registerStrategy, loginStrategy}:

```javascript
const LocalStrategy = require ('passport-local');
const passport = require ('passport')
const { userModel } = require ('../models/users')
const { createHash, isValid } = require ('../utils/bcrypt')

const registerStrategy = new LocalStrategy(async (username, password, cb) => {
    try {
        const user = await userModel.findOne({username})
        if(user){ return cb(null, false, {message: 'User already exist'})}

        const hash = createHash(password)
        const newUser = await userModel.create({username, password: hash})

        console.log(newUser)
        return cb(null, newUser)
    } catch (error) {
        return cb(error)
    }
})

const loginStrategy = new LocalStrategy(async (username, password, cb) => {
    try {
        const user = await userModel.findOne({username})
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

module.exports = {registerStrategy, loginStrategy};
```

## Configuracion de Mongo Store

* Configuracion en app js

```javascript
//trae el archivo options con la coneción a mongoDB Atlas
const connection= require ('./loaders/connection');

//server Express
const express = require('express');
const session= require('express-session');

const MongoStore = require('connect-mongo');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}


```

* se configura para una sesion una sesion

```javascript
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
}))

```

* se configura una ruta que gestiona las autenticaciones

```javascript
//path route session
const sessionRouter = require('./routes/session.router')

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
const express = require('express');
const route = express.Router();

const passport =require ("passport");

``` 

 * En Route Session, su ruta raíz fiscaliza si hay sesion activa. si no es así  deriva a ruta'login':

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

* En Route Session,  al get '/login' se le pasa isAuthenticated() para verificar si no hay sesión activa para mandar a la vista login,  si hay sesión deriva a la dirección '/create' que es la del dashborad.

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
## Vista Login

* el formulario envia a la ruta /session/login con metodo Post el email y el password:

```javascript
<div class="page-header">
            <h1>Login Auth</h1>
        </div>
 
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li><a href="/session/register">Sign Up</a></li>
                        <li><a href="/create">Dashboard</a></li>
                    </ul>
 
                    
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
 
        <div class="container row">
            <div class="jumbotron col-sm-4 pull-center">
            
                <form autocomplete="off" action="/session/login" method="post">
                    <div class="form-group">
                        <label>Email:</label>
                        <input class="form-control" required type="email" name="username"/>
                    </div>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input class="form-control" required type="password" name="password"/>
                    </div>
                    <div class="form-group">
                        <input class="btn btn-primary" type="submit" value="Log In"/>
                    </div>
                </form>                  
            </div>          
        </div>
```
* este Post impacta en la ruta session:

```javascript
route.post('/login', passport.authenticate('login', { failureRedirect: '/failureLogin'}), (req, res) => {
    res.redirect('/create')
})
```

* Si esta todo bien, la ruta lleva a la direccion /create que está en app.js y que manda a la vista create-product el user:


```javascript
app.get('/create',(req, res)=>{
    if(req.isAuthenticated()){
        res.render('create-product',{
            user: req.user.username, 
            })

    }
    else{ res.redirect('/')}
})
```

* pero si hay un error lo envia a la vista 'fail-login'

```javascript
<main class="container mt-3">
        <div class="p-3 mt-4 bg-light bg-gradient">
            <div class="d-flex justify-content-between align-items-center">
                <p class="text-danger mb-0" >USER ERROR LOGIN</p>
                <button class="btn btn-primary"><a href="/" style="text-decoration: none; color: inherit;">Back</a></button>
            </div>
        </div>
    </main>
```

## Vista Signup
* Se llega a través del link que hay en la vista login. Aquí el usuario carga su email y password. que impacta mediante post en session/register:

```javascript
route.get('/register', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('signup')
    }
    else {
        res.redirect('/create')
    }
})
```

```javascript
<div class="page-header">
            <h1>Signup Auth</h1>
        </div>
 
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                    
                        <li><a href="/session/login">Log IN</a></li>
                        <li><a href="/create">Dashboard</a></li>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>

        <div class="container row">
            <div class="jumbotron col-sm-4 pull-center">
                <form autocomplete="off" action="/session/register" method="post">
                    <div class="form-group">
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input class="form-control" required type="email" name="username"/>
                    </div>    
                    <div class="form-group">
                        <label>Password:</label>
                        <input class="form-control" required type="password" name="password"/>
                    </div>
                    <div class="form-group">
                        <input class="btn btn-primary" type="submit" value="Sign Up"/>
                    </div>
                </form>                  
            </div>          
        </div>
```

este Post impacta en la ruta session /register. si se crea el usuario te redirige al logind si no a la vista fail-register :

```javascript
route.post('/register', passport.authenticate('register', {
    failureRedirect: '/failureRegister'}),
(req, res) => {
        res.redirect('/login') 
}
)
```

* fail register

```javascript
route.post('/failureRegister', (req, res) => {
    res.render('fail-register')
})
```

```javascript
<main class="container mt-3">
        <div class="p-3 mt-4 bg-light bg-gradient">
            <div class="d-flex justify-content-between align-items-center">
                <p class="text-danger mb-0" >USER ERROR SIGNUP</p>
                <button class="btn btn-primary"><a href="/" style="text-decoration: none; color: inherit;">Back</a></button>
            </div>
        </div>
    </main>
```



## Vista Create-Product
* Aquí se recibe el usuario y se continua con la carga de productos par el chat

```javascript
<div class="container-fluid flex mx-2">
    <h2>Welcome </h2> 
    <h2 id="userTitle">{{user}}</h2> 
    <a href="/session/logout" style="text-decoration: none; color: inherit;">
                <button type="button" class="btn btn-outline-success">Logout</button>
    </a>
</div> 
<h2>Create a product</h2>
<form id="productsForm">
    <label>Title:</label>
    <input name="title">
    <label>Price:</label>
    <input name="price">
    <label>Thumbnail:</label>
    <input name="thumbnail">
    <input type="submit">
</form>
<hr />
<div id="history">without products to show</div>
<hr />
<h2>Messages history</h2>
<form id="chatForm">
    <input name="email">
    <div id="chatHistory">without messages to show</div>
    <input name="message">
    <input type="submit">
</form>
```

* el boton logout de esta vista impacta en session, donde deslogea al enviarte a la vista logout y esta te redirige a la vista login :

```javascript
route.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('logout', {user: req.user.username})
    } else {
        res.redirect('/login')
    }
})
```
* vista logout:

```javascript
<div class="container-fluid">
<h2>Hasta la proxima</h2>
<h3>{{user}}</h3>
</div>

<script>
    setTimeout(() => fetch('/session',{
            method: 'DELETE'
        }).then(location.href = '/'), 2000)
</script>
```

* esta manda con un script el metodo delete de session que destruye la sesion.

```javascript
//delete the session
route.delete('/logout', (req, res) => {
    if (req.isAuthenticated()) {
            return res.redirect('/login')
    }
    else{
        return res.redirect('/login')
    }
})


module.exports =  route
```


## Creación de objeto Knex y tablas
* se creó el script options ya instanciando un objeto knex para dar los métodos a cualquier parte que se exporte tanto MySQL como SQLITE.


```javascript
 const MySQLOptions =require("knex")( {
    client: process.env.DB_CLIENT||'mysql',
    connection: {
        host: process.env.DB_HOST||'127.0.0.1',
        user: process.env.DB_USER||'root',
        password:process.env.DB_PASSWORD||"",
        database: process.env.DB_NAME||"ecommerce"
    }
    
})

module.exports= MySQLOptions;
```

[!NOTA] en este caso el script de sqlite3

```javascript
let SQLOptions= require("knex")({
    client:process.env.DB_HOST_II||'sqlite3',
    connection:{
        filename: "./src/DB/ecommerce.sqlite3",
    },
    useNullAsDefault: true
})

module.exports= SQLOptions;
```

* se creron 2 script que generan las bases de datos al que se le añadió el objeto knex y un nombre específico de tabla, en estos casos, **products** para products y **chats** para los chats. Al ejecutar el app.js se crean ambas tablas


```javascript
//objet Knex mysql client
const myDB = require('./mysql.config');

const createTable1= async( myTable)=>{
    try{
        let message = ''
        if(!await myDB.schema.hasTable(myTable)){
            await myDB.schema.createTable(myTable, table => {
                table.increments('id')
                table.string('title').nullable(false)
                table.float('price').nullable(false)
                table.string('thumbnail').nullable(false)
            })
            message = `Table ${myTable} created - `
        }

        return {status: 'success', result: message}
    }catch (err){
        throw {status : 'Error', result : {msg : err.message, code : err.code}}
    }finally{
        //destroy tables connection
        myDB.destroy()
    }
}

module.exports = createTable1;
```

```javascript	
//objet Knex sqlite client
const liteDB = require('./sqlite.config');

const createTable2= async( liteTable)=>{
    try{
    if(!await liteDB.schema.hasTable(liteTable)){
        await liteDB.schema.createTable(liteTable, table => {
            table.increments('id')
            table.string('email')
            table.string('msg')
            table.time('date')
        })
        message += `Table ${liteTable} created`
    }
    return {status: 'success', result: message}
}catch (err){
    throw {status : 'Error', result : {msg : err.message, code : err.code}}
}finally{
    //destroy tables connection
    liteDB.destroy()}
}

module.exports = createTable2;
```


## Creación de las tablas en script app.js

* se crean dos variables con strings de los nombres de las tablas dentro de la base de datos. La creación de tablas es instanciada en la misma creación del servidor.

```javascript
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
```


## Creación del controller product##

1.creación del constructor al cual se le pasa una base de datos, en este caso el objeto knex, y el nombre de la tabla que se ejecutarán las busquedas en los metodos del objetos knex.

```javascript
class ProductManager {

    constructor(bd,table) {

        this.db=bd;
        this.table=table;
    }
```
* creación del método create, que ingresa un producto en la tabla, recibe un objeto preparado desde el product.router y *para mayor seguridad* se lo desestructura para que ingrese en la misma ubicación como pide la tabla.

[!NOTE] Desde el Router

```javascript
router.post('/', async(req, res) => {
    try{
        
    if (!req.body.title || !req.body.price || !req.body.thumbnail) return res.send({error: 'data is required'})
    const product = ({title, price, thumbnail}=req.body);
    let result = await manager.create(product)
    res.send(result)
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}

})
```

[!NOTE] En el controller

```javascript
    async create(product){
        
        
        product={
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail
        }
        
        await this.db(this.table).insert(product)
        
    }
```

* creación del método ``findAll()``, que busca a todos los productos de la base de datos (al cololcar un objeto vacio trae todos los objetos). y se convierte el dato recibído de la BD a json para retornarlo ya transformado al router.product. 

[!NOTE] En el controller

```javascript	
    async findAll(){
    
        let result=JSON.parse(JSON.stringify(
            await this.db(this.table)
            .where({})
            .select("id","title","price","thumbnail")))
        
        return result; 
    }
```
[!NOTE] Desde el Router

```javascript
router.get('/', async(req, res) => {
    try{
    let result = await manager.findAll()
    res.send(result)
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}
})
```

* creación del método ``findById()``, el cual retorna un producto específico, tras haber recibido un id desde el router.product.

[!NOTE] En el controller

```javascript
router.get('/:id', async(req, res) => {
    try{
    let result = await manager.findById(req.params.id)
    if (!result) return res.send({error: 'product was not found'})
    res.send(result)
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}

})
```

[!NOTE] Desde el Router

```javascript
router.get('/:id', async(req, res) => {
    try{
    let result = await manager.findById(req.params.id)
    if (!result) return res.send({error: 'product was not found'})
    res.send(result)
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}

})
```

* creación del método ``update()``, el cual actualiza un producto recibiendo del router.product un id y los datos actualizados.

[!NOTE] Desde el Router

```javascript
router.put('/:id', async(req, res) => {
    try{
    if (!req.body.title || !req.body.price || !req.body.thumbnail) return res.send({error: 'data is required'})
    
    const product = ({title, price, thumbnail}=req.body)
    let result = await manager.update(req.params.id, product)
    if (!result) return res.send({error: 'product was not found'})
    res.send(result)
}catch{(err=>console.log(err))}
finally{(()=>mysql.destroy())}
})
```

[!NOTE] En el controller

```javascript
async update(params, product){
        id = parseInt(params)
        await this.db(this.table)
        .where('id',id)
        .update(product)
        return await this.findById(id)
    }
```
* creación del método ``delete()``, el cual borra un producto específico mediante un id, enviado desde el router.product . 

[!NOTE] Desde el Router

```javascript
    router.delete('/:id', async(req, res) => {
    try{
    let result = await manager.delete(req.params.id)
    res.send(result)
}catch{(err=>console.log(err))}
finally{(()=>mysql.destroy())}

})
```
[!NOTE] En el controller

```javascript
	async delete(params){
        id = parseInt(params)
        await this.db(this.table).where('id',id).del()
        
    }
}
```
* creación de la exportación del controller

```javascript
module.exports = router;
```
* product models, script dentro de la carpeta models donde se comparte  el archivo con la lista de productos para las funciones que lo soliciten.

```javascript	
const mysql = require('../options/mysql.config');

const N_TABLE="products"
const Manager= require('../controllers/product.manager')
const manager = new Manager(mysql,N_TABLE);
let productsList = manager.findAll()
.then(products => products)
.catch(err => console.log(err))

module.exports = productsList;
```

## Creación del creación del controller chat

* creación del constructor de la clase Chat, que recibe un objeto knex con la configuración de la base de datos sqlite.

```javascript	
class ChatManager {

    constructor(bd,table) {
        this.db=bd;
        this.table=table;
    };
```

* creacion del método ``create()``, el cual ingresa a la DB los datos de un mensaje de chat. el método recibe del chat.router el mensaje ya destructurado para que coicida con los datos que recibe la tabla *chats*.

[!NOTE] Desde el Router
```javascript
    router.post('/', (req, res) => {
    try{
    if (!req.body.email || !req.body.message) return res.send({error: 'data is required'})
    // create the new objet `Date`
    const now = new Date();
    const date = now.toLocaleString();
    const {email, msg} =req.body;
    const message = {
        email,
        msg,
        date
    }
    manager.create(message).then(result => res.send(result))
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}
})
```

[!NOTE] En el controller

```javascript
async create(message){
        try {
                message = {
                    email: message.email,
                    timestamp: new Date().toLocaleString(),
                    message: message.message
                }
                await this.db(this.table).insert(message)
                
                return [message]
        } catch(err) {
            return {status: "error", message: err.message}
        }
    }
```

* Creación del método ``findAll()``, el cual envia todos los chats guardados en la base de datos, al chat.router

[!NOTE] Desde el Router
```javascript
router.get('/', (req, res) => {
    try{
    manager.findAll().then(result => res.send(result))
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}
})
```

[!NOTE] En el controller

```javascript
     async findAll(){
        let chat= result=JSON.parse(JSON.stringify(
        await this.db(this.table).where({}).select("email","msg","date")))
        ||[];
        return chat; 
    }
}
```

* chat models, script dentro de la carpeta models donde se comparte  el archivo con la lista de chat para las funciones que lo soliciten.

```javascript
const sqlLite= require('../options/sqlite.config');

const tbl_chats= "chats";
const Manager = require('../controllers/chat.manager');
const manager = new Manager(sqlLite,tbl_chats);

let chat = manager.findAll()
.then(chats=>chats)
.catch(err => console.log(err))

module.exports = chat;
```

## Evento socket.io

* evento para conectar el chat.

En la cabecera de App.js:
```javascript
//configuration web socket 
const {Server}= require('socket.io');
const io = new Server(server);
```

```javascript
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
```







