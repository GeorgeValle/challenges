import express from 'express';
const route = express.Router();
import passport from "passport";




route.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('home')
    }
    else{
        res.redirect('/create')
    }
})

route.get('/register', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('signup')
    }
    else {
        res.redirect('/create')
    }
})


route.post('/register', passport.authenticate('register', {
    failureRedirect: 'failureRegister/'}),
(req, res) => {
        
        res.render('login') 
}
)

route.get('/login', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('login')
    }
    else {
        res.redirect('create/')
    }
})


route.post('/login', passport.authenticate('login', { failureRedirect: 'failureLogin/'}), (req, res) => {
    res.redirect('create/')
})

route.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('logout', {user: req.user.name})
    } else {
        res.redirect('/session/login')
    }
})



//route for logout passport session
route.delete('/logout', function(req, res) {
    
        req.logout(function(err) {
            if (err) { return next(err);}
        return res.redirect('home/')
    
        })
})


route.get('/failureLogin', (req, res) => {
    res.render('fail-login')
})

route.post('/failureLogin', (req, res) => {
    res.render('fail-login')
})

route.get('/failureRegister', (req, res) => {
    res.render('fail-register')
})

route.post('/failureRegister', (req, res) => {
    res.render('fail-register')
})

route.get('/create',(req, res)=>{
    if(req.isAuthenticated()){
        book.
        res.render('dashboard',{
            user: req.user.name, avatar: req.user.avatar
            })

    }
    else{ res.redirect('/')}
})

//route.get('/user', userModel.getById)


const sessionRouter = route; 
export {sessionRouter};