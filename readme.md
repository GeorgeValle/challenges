# Pasos Hechos en Desafio 42 testin

* se completaroin todas las funciones del DAO file sistem en la carpeta DAO. se exportaron las funciones al servicio luego este se lo transfirió al controler para que este lo pase a la route. 

* se crearon dos test.js en la carpeta test. uno automatizado con mocha y el otro manual con axios. 

* uno se ejecuta con NPM run auto y el otro con NPM run test.



### instalar el compression

```javascript
//Compression
const compression = require('compression');

//middleware Compression antes de la iniciación del server
app.use(compression({
    //level por defaault
    level6

}))


```

## Consignas:

### numero de procesadores:

* Configuración de la ruta:

```javascript
const infoRouter = require('./routes/info.router');


app.use('/info', infoRouter)

```

* info router, donde crea un objeto que envia a la view info. para ver todos los datos requeridos:


```javascript
const express = require('express');
const route = express.Router();

const yargs = require('yargs');


route.get('/info', (req, res) => {
        // res.render('info')
        res.render('info', {
            argvs: process.argv.slice(2),
            platform: process.platform,
            node: process.version,
            memory: process.memoryUsage().rss,
            path: process.execPath,
            pid: process.pid,
            folder: process.cwd()
            //para ver los procesadores
            cpus: processor_count
        })
    }
)


module.exports =route;
```
* view info (con el añadido de los 8 nucleos):

```javascript
<div class="modal position-static d-block bg-secondary py-5" tabindex="-1" role="dialog" id="modalLogin" style="height: 100vh;">
    <div class="modal-dialog" role="document" style="max-width: 800px;">
        <div class="modal-content rounded-4 shadow">
            <div class="modal-header p-5 pb-4 border-bottom-0">
                <h3 class="fw-bold mb-0">Información de la plataforma</h3>
            </div>

            <div class="modal-body p-5 pt-0">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Item</th>
                            <th scope="col">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>argvs</td>
                            <td>{{argvs}}</td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>platform</td>
                            <td>{{platform}}</td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>node</td>
                            <td>{{node}}</td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>memory</td>
                            <td>{{memory}}</td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>path</td>
                            <td>{{path}}</td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>pid</td>
                            <td>{{pid}}</td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>folder</td>
                            <td>{{folder}}</td>
                        </tr>
                         <tr>
                            <th scope="row">8</th>
                            <td>cpu count</td>
                            <td>{{cpus}}</td>
                        </tr>
                    </tbody>
                </table>
                <a href="/" class="w-100 mb-2 btn btn-lg rounded-3 btn-success">Volver a inicio</a>
            </div>
        </div>
    </div>
</div>
```

### Consigna: Ejecutar el servidor  (modo Fork y cluster) con nodemon

```javascript
    'nodemon ./src/app.js --mode=cluster' //(ejecuta en modo cluster)
    'nodemon ./src/app.js --mode=fork' //(ejecuta modo fork)
    'nodemon ./src/app.js' //(ejecuta modo fork por defecto)
```

### consigna: Ejecutar el servidor (con los parámetros adecuados: modo fork) utilizando PM2 en sus modos fork y cluster. Listar los procesos por PM2 y por sistema operativo

```javascript
'pm2 start ./src/app.js --name="nodeServerFork"' //para inciar en modo Fork de PM2

'pm2 start ./src/app.js --name="nodeServerCluster" -i max' // para iniciar en modo Cluster de PM2 utilizando todos los núcleos
```
### Consigna: PM2 permitir el modo escucha, para que la actualización del código del servidor se vea reflejado inmediatamente en todos los procesos

```javascript
'pm2 start ./src/app.js --name="nodeServerCluster" --watch -i max' // agregamos el parámetro --watch para permitir el modo watch o escucha
```

### consigna: Hacer pruebas de finalización de procesos Fork y Cluster en los casos que corresponda

Realizado con 'kill' sobre los procesos hijos, en  pm2 no observo un proceso padre como sucede con nodemon, pues este último arroja una advertencia de crasheo y no incia automáticamente

### consigna: Configurar nginx para balancear cargas en nuestro servidor de la siguiente manera

* Redirigir todas las consultas a /api/randoms a un cluster de servidores escuchando en el puerto 8081. El cluster será creado en node utilizando el módulo nativo cluster

Inicio el servidor random en modo cluster con 'pm2 start random.js --name=ramdomCluster --watch -- --port=8081 --mode=cluster'

* El resto de consultas, redirigirlas a un servidor individual escuchando en el puerto 8080

Inicio el servidor general en modo fork con 'pm2 start index.js --name=serverFork --watch -- --port=8080'

* Verificar que todo funcione correctamente
Inicio nginx utilizando la configuración 'nginx/nginx_nodecluster.conf', funciona el servidor general informando que es un servidor express, el PID y la hora local. El servidor random responde informando el ID del worker además de los números random para confirmar que estamos ante un cluster.

* Luego, modificar la configuración para que todas las consultas a /api/randoms sean dirigidas a un cluster de servidores gestionado desde nginx, repartiendolas equitativamente entre 4 instancias escuchando en los puertos 8082, 8083, 8084 y 8085 respectivamente

Para esta prueba el servidor general se mantiene igual que antes y se inicia de la misma forma, pero en el servidor random se incian cuatro instancias 'pm2 start random.js --name=ramdomCluster --watch -- --port=8082' cambiando el número de puerto para que sean 8082, 8083, 8084 y 8085. Sin especificar el modo cluster para que por defecto inicie cada uno en modo fork. Para esta prueba nginx utilizará la configuración del archivo './src/nginx/nginx.conf' el cual se comento el servidor random en el puerto 8081 y se sumaron los otros servidores sin definir para que nginx haga el balance de carga equitativo.


## Dependencias
```javascript
   "dependencies": {
    "bcrypt": "^5.1.0",
    "connect-mongo": "^4.6.0",
    "dotenv": "^16.0.3",
    "express": "^4.18.1",
    "express-handlebars": "^6.0.6",
    "express-session": "^1.17.3",
    "mongodb": "^4.11.0",
    "moongose": "^1.0.0",
    "nodemon": "^2.0.20",
    "parser": "^0.1.4",
    "passport": "^0.6.0",
    "passport-local": "^1.0.0",
    "session-file-store": "^1.5.0",
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

## configuarción de Yargs

* App.js se  configura la librería Yargs para recibir parametros por consola, y el puerto se inicia por el numero que mandamos por consola.

```javascript
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const port = argv.port || 8080


const server = app.listen(port, async ()=>{
    console.log(`listening on port ${port}`)
```



* use route random:

```javascript
const randomRouter = require('./routes/random.router');


app.use('/random', randomRouter);
```

* random router js que a su vez importa la logia modularizada para enviarla al front:

```javascript
const express = require('express')
const router = express.Router()
const {fork} = require('child_process')
const child = fork('../utils/randomGenerator.js')

router.get('/', async (req, res) => {
    const rounds = req.query.cant || 100000000
    child.send(rounds)
    child.on('message', (msg) => {
        res.end(msg)
    })
})

module.exports =  router
```

* La lógica del random generator que se encuentra en la carpeta utils:

```javascript
function randomGenerator(qty) {

    let rndList = {}
    for (let num=0; num <= qty; num++) {
        let rndNum = parseInt(Math.random() * (1000 - 1) + 1)
        if (rndList.hasOwnProperty(rndNum)) {
            rndList[rndNum] += 1
        } else {
            rndList[rndNum] = 1
        }
    }
    return JSON.stringify(rndList)
}

process.on('message', (msg => {
    const rndList = randomGenerator(parseInt(msg))
    process.send(rndList)
}))
```

## Configuración del servidor cluster / fork en app.js

```javascript
//Cluster
const cluster = require('cluster');

//CPUs 
const processor_count = require('os').cpus().length;

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
} else {/*servidor por default*/}
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




## Creación del controller product##

1.creación del constructor al cual se le pasa una base de datos, en este caso el objeto knex, y el nombre de la tabla que se ejecutarán las busquedas en los metodos del objetos knex.

```javascript

```
* creación del método create, que ingresa un producto en la tabla, recibe un objeto preparado desde el product.router y *para mayor seguridad* se lo desestructura para que ingrese en la misma ubicación como pide la tabla.

[!NOTE] Desde el Router

```javascript

```

[!NOTE] En el controller

```javascript
    
```

* creación del método ``findAll()``, que busca a todos los productos de la base de datos (al cololcar un objeto vacio trae todos los objetos). y se convierte el dato recibído de la BD a json para retornarlo ya transformado al router.product. 

[!NOTE] En el controller

```javascript	
    
```
[!NOTE] Desde el Router

```javascript

```

* creación del método ``findById()``, el cual retorna un producto específico, tras haber recibido un id desde el router.product.

[!NOTE] En el controller

```javascript

```

[!NOTE] Desde el Router

```javascript

```

* creación del método ``update()``, el cual actualiza un producto recibiendo del router.product un id y los datos actualizados.

[!NOTE] Desde el Router

```javascript

```

[!NOTE] En el controller

```javascript

```
* creación del método ``delete()``, el cual borra un producto específico mediante un id, enviado desde el router.product . 

[!NOTE] Desde el Router

```javascript
   
```
[!NOTE] En el controller

```javascript
	
```
* creación de la exportación del controller

```javascript

```
* product models, script dentro de la carpeta models donde se comparte  el archivo con la lista de productos para las funciones que lo soliciten.

```javascript	

```

## Creación del creación del controller chat

* creación del constructor de la clase Chat, que recibe un objeto knex con la configuración de la base de datos sqlite.

```javascript	

```

* creacion del método ``create()``, el cual ingresa a la DB los datos de un mensaje de chat. el método recibe del chat.router el mensaje ya destructurado para que coicida con los datos que recibe la tabla *chats*.

[!NOTE] Desde el Router
```javascript
    
```

[!NOTE] En el controller

```javascript

```

* Creación del método ``findAll()``, el cual envia todos los chats guardados en la base de datos, al chat.router

[!NOTE] Desde el Router
```javascript

```

[!NOTE] En el controller

```javascript
```

* chat models, script dentro de la carpeta models donde se comparte  el archivo con la lista de chat para las funciones que lo soliciten.

```javascript

```









