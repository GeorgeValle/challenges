const express = require('express');
const router = express.Router();
const sqlite= require('../options/sqlite.config');
const tbl_chats = "chats";


const Manager = require('../controllers/chat.manager')
const manager = new Manager(sqlite,tbl_chats)

router.get('/', (req, res) => {
    try{
    manager.findAll().then(result => res.send(result))
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}
})

router.post('/', (req, res) => {
    try{
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
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}
})

module.exports = router