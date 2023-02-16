const express = require('express');
const route = express.Router();
const passport =require ("passport");
const {
    getAuthManager,
getRegisterManager,
getLoginManager,
getAuthLogoutManager,
deleteAuthLogoutManager,
postAuthFailureLogin,
postAuthFailureRegister,
getAuthDashboard
} = require('../controllers/session.manager')



route.get('/', getAuthManager )

route.get('register/', getRegisterManager)


route.post('/register', passport.authenticate('register', {
    failureRedirect: '/failureRegister'}),
(req, res) => {
        res.redirect('/login') 
}
)

route.get('/login',getLoginManager )

route.post('/login', passport.authenticate('login', { failureRedirect: '/failureLogin'}), (req, res) => {
    res.redirect('/create')
})

route.get('/logout', getAuthLogoutManager )


route.delete('/logout', deleteAuthLogoutManager)

route.post('/failureLogin', postAuthFailureLogin)

route.post('/failureRegister', postAuthFailureRegister)

route.get('/create', getAuthDashboard)

module.exports =  route