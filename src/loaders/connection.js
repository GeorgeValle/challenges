const dotenv = require ('dotenv');
dotenv.config();
const mongoose = require ('mongoose');

const uri= process.env.DB_MONGO//'mongodb://localhost/passport-auth' //process.env.DB_ATLAS||
const ear= mongoose.connection;

mongoose.connect(uri,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
    dbName: 'auth-local'
}).catch(err => {console.log(err)});

ear.once('open',_=>{
    console.log(`Mongo Database  is connected to: `, uri)
})

ear.on('error', err => {console.log(`Type error: ${err}`)});