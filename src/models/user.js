//schema for mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true},
    date: {}
})

