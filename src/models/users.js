//schema for mongoose
import mongoose from 'mongoose';
const {Schema} = mongoose;

//connection
import Connection from '../loaders/connection';



const userSchema = new Schema({
    // username: { 
    //     type: String,
    //     required: true },
    username: { 
        type: String,
        unique: true,
        required: true},

    password: { 
        type: String,
        required: true},
    // date: {}
})

const userModel = mongoose.model('user', userSchema)
//see si no genera error
export {userModel}
