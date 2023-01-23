const express = require('express')
const router = express.Router()
const {fork} = require('child_process')
const child = fork('./src/utils/randomGenerator')

router.get('/', async (req, res) => {
    const rounds = req.query.cant || 100000000
    child.send(rounds)
    child.on('message', (msg) => {
        res.end(msg)
    })
})

module.exports =  router