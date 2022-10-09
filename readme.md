#Pasos Hechos (spanish)

##Creación de objeto Knex y tablas
1. se creó el script options ya instanciando un objeto knex para dar los métodos a cualquier parte que se exporte tanto MySQL como SQLITE.


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
        filename: ":/src/DB/ecommerce.sqlite3",
    },
    useNullAsDefault: true
})

module.exports= SQLOptions;
```

1. se creó el script que genera las bases de datos al que se le añadió el objeto knex y un nombre específico de tabla, en estos casos, **products** para products y **chats** para los chats. Al ejecutar el app.js se crean ambas tablas

```javascript
//objet Knex mysql client
const myDB = require('./mysql.config');
//objet Knex sqlite client
const liteDB = require('./sqlite.config');

const createTables= async( myTable,liteTable)=>{
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
        myDB.destroy()
        liteDB.destroy()
    }
}

module.exports = createTables;
```

##Creación de las tablas en script app.js

1. se crean dos variables con strings de los nombres de las tablas dentro de la base de datos. La creación de tablas es instanciada en la misma creación del servidor.

```javascript
const tbl_Products ="products";
const tbl_chats = "chats";

const server = app.listen(PORT, async ()=>{
    console.log(`listening on port ${PORT}`)
    
try{
    await createTables(tbl_Products, tbl_chats)
    console.log('Databases was created!')
}catch {
    console.log('Error in databases tables creation')
}
})
```

##creación de controllers product

1.creación del constructor al cual se le pasa una base de datos, en este caso el objeto knex, y el nombre de la tabla que se ejecutarán las busquedas en los metodos del objetos knex.

```javascript
class ProductManager {

    constructor(bd,table) {

        this.db=bd;
        this.table=table;
    }
```
1. creación del método create, que ingresa un producto en la tabla, recibe un objeto preparado desde el product.router y *para mayor seguridad* se lo desestructura para que ingrese en la misma ubicación como pide la tabla.

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

1. creación del método ``findAll()``, que busca a todos los productos de la base de datos (al cololcar un objeto vacio trae todos los objetos). y se convierte el dato recibído de la BD a json para retornarlo ya transformado al router.product. 

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

1. creación del método ``findById()``, el cual retorna un producto específico, tras haber recibido un id desde el router.product.

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

1. creación del método ``update()``, el cual actualiza un producto recibiendo del router.product un id y los datos actualizados.

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
1. creación del método ``delete()``, el cual borra un producto específico mediante id enviado desde el router.product. 

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
1. creación de la exportación del controller

```javascript
module.exports = router;
```








