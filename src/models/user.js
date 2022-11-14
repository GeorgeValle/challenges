//schema for mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

//connection
const Connection = require('../loaders/connection');



const userSchema = new Schema({
    username: { 
        type: String,
        required: true },
    email: { 
        type: String,
        unique: true,
        required: true},

    password: { 
        type: String,
        required: true},
    //date: {}
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel
