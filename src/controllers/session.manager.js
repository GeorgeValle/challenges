
const {errorLogger,infoLogger,consoleLogger,warnLogger} = require('../utils/loggers')

// const sessionChecker =  require ('../models/sessionCheckers');

// route.get('/login', sessionChecker, (req, res) => {
//     res.redirect('/login')
// })


const getAuthManager = (req, res) => {
    if (!req.isAuthenticated()) {
        
        res.render('login')
    }
    else{
        res.redirect('/create')
    }
}

const getRegisterManager= (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('signup')
    }
    else {
        res.redirect('/create')
    }
}


// route.post('/register', passport.authenticate('register', {
//     failureRedirect: '/failureRegister'}),
// (req, res) => {
//         res.redirect('/login') 
// }
// )

const getLoginManager = (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('login')
    }
    else {
        res.redirect('/create')
    }
}

// route.post('/login', passport.authenticate('login', { failureRedirect: '/failureLogin'}), (req, res) => {
//     res.redirect('/create')
// })

const getAuthLogoutManager = (req, res) => {
    if (req.isAuthenticated()) {
        infoLogger.info('logout user: '+req.username)
        res.render('logout', {user: req.user.username})
    } else {
        res.redirect('/login')
    }
}


const deleteAuthLogoutManager = (req, res) => {
    if (req.isAuthenticated()) {
            return res.redirect('/login')
    }
    else{
        return res.redirect('/login')
    }
}


const postAuthFailureLogin = (req, res) => {
    errorLogger.error('Fail login user: ')
    res.render('fail-login')
}

const postAuthFailureRegister = (req, res) => {
    errorLogger.error('Fail register user: ')
    res.render('fail-register')
}

const getAuthDashboard = (req, res)=>{
    if(req.isAuthenticated()){
        res.render('create-product',{
            user: req.user.username, 
            })

    }
    else{ res.redirect('/')}
}

module.exports =  {
    getAuthManager,
getRegisterManager,
getLoginManager,
getAuthLogoutManager,
deleteAuthLogoutManager,
postAuthFailureLogin,
postAuthFailureRegister,
getAuthDashboard
}