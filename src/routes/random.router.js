const express = require('express')
const route = express.Router()
// const {fork} = require('child_process')
// const child = fork('./src/utils/randomGenerator')
const {getRandomProcess} = require('../controllers/random.manager')

route.get('/random', getRandomProcess )

module.exports =  route