# Pasos Hechos (spanish) 

## Dependencias
```javascript
"dependencies": {
    "express": "^4.18.1",
    "express-handlebars": "^6.0.6",
    "knex": "^2.3.0",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.20",
    "socket.io": "^4.5.2",
    "sqlite3": "^5.1.2"
  }
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







