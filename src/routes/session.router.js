const express = require('express');
const route = express.Router();
const passport =require ("passport");
const {errorLogger,infoLogger,consoleLogger,warnLogger} = require('../utils/loggers')

// const sessionChecker =  require ('../models/sessionCheckers');

// route.get('/login', sessionChecker, (req, res) => {
//     res.redirect('/login')
// })


route.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        
        res.render('login')
    }
    else{
        res.redirect('/create')
    }
})

route.get('register/', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('signup')
    }
    else {
        res.redirect('/create')
    }
})


route.post('/register', passport.authenticate('register', {
    failureRedirect: '/failureRegister'}),
(req, res) => {
        res.redirect('/login') 
}
)

route.get('/login', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('login')
    }
    else {
        res.redirect('/create')
    }
})

route.post('/login', passport.authenticate('login', { failureRedirect: '/failureLogin'}), (req, res) => {
    res.redirect('/create')
})

route.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        infoLogger.info('logout user: '+req.username)
        res.render('logout', {user: req.user.username})
    } else {
        res.redirect('/login')
    }
})


route.delete('/logout', (req, res) => {
    if (req.isAuthenticated()) {
            return res.redirect('/login')
    }
    else{
        return res.redirect('/login')
    }
})


route.post('/failureLogin', (req, res) => {
    res.render('fail-login')
})

route.post('/failureRegister', (req, res) => {
    res.render('fail-register')
})

route.get('/create',(req, res)=>{
    if(req.isAuthenticated()){
        res.render('create-product',{
            user: req.user.username, 
            })

    }
    else{ res.redirect('/')}
})

module.exports =  route