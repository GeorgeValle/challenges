const express = require('express');
const route = express.Router();

const sessionChecker =  require ('../models/sessionCheckers');

// route.get('/login', sessionChecker, (req, res) => {
//     res.redirect('/login')
// })

route.get('/login', sessionChecker, (req, res) => {
    res.render('login')
})

route.post('/', (req, res) => {
    req.session.user = req.body
    req.session.save(err => err && console.log(err))
    res.redirect('/create')
})

//logout
route.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('logout', {user: req.session.user.name})
    } else {
        res.redirect('/login')
    }
})


//delete the session
route.delete('/', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        req.session.destroy()
        //res.clearCookie('user_sid')
    }
    res.redirect('/login')
})

module.exports =  route