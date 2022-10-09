const express = require('express');
const router = express.Router();
const sqlite= require('../options/sqlite.config');
const tbl_table = "chats";


const Manager = require('../controllers/chat.manager')
const manager = new Manager(sqlite,tbl_table)

router.get('/', (req, res) => {
    manager.findAll().then(result => res.send(result))
})

router.post('/', (req, res) => {
    if (!req.body.email || !req.body.message) return res.send({error: 'data is required'})
    // create the new objet `Date`
    const now = new Date();
    const date = now.toLocaleString();
    const {email, msg} =req.body;
    const message = {
        email,
        msg,
        date
    }



    manager.create(message).then(result => res.send(result))
})

module.exports = router