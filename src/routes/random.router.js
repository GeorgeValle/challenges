const express = require('express')
const router = express.Router()
// const {fork} = require('child_process')
// const child = fork('./src/utils/randomGenerator')
const {getRandomProcess} = require('../controllers/random.manager')

router.get('/random', getRandomProcess )

module.exports =  router