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


