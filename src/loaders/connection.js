import mongoose, {mongo} from 'mongoose';

const uri= 'mongodb+srv://jorge:racing468246@clustergiorgio.o5vjsjo.mongodb.net/?retryWrites=true&w=majority';
const ear= mongoose.connection;


mongoose.connect(uri,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).catch(err => {console.log(err)});

ear.once('open',_=>{
    console.log(`Database is connected to: `, uri)
})

ear.on('error', err => {console.log(`Type error: ${err}`)});