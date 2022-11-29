
//not use in this challenge
const sessionChecker = (req, res, next) => {
    if(req.session.user && req.cookies.user_sid){
        res.redirect('/create')
    }
    else {
        next()
    }
}

module.exports = sessionChecker