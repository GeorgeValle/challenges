const LocalStrategy = require ('passport-local');
const passport = require ('passport')
const { userModel } = require ('../models/users')
const { createHash, isValid } = require ('../utils/bcrypt')

const registerStrategy = new LocalStrategy(async (username, password, cb) => {
    try {
        const user = await userModel.findOne({username})
        if(user){ return cb(null, false, {message: 'User already exist'})}

        const hash = createHash(password)
        const newUser = await userModel.create({username, password: hash})

        console.log(newUser)
        return cb(null, newUser)
    } catch (error) {
        return cb(error)
    }
})

const loginStrategy = new LocalStrategy(async (username, password, cb) => {
    try {
        const user = await userModel.findOne({username})
        if(!user){ return cb(null, false, { message: 'User does not exist' })}

        if(!isValid(user, password)){ return cb(null, false, { message: 'Wrong password' })}
        
        return cb(null, user)
    } catch (error) {
        return cb(error)
    }
})

passport.serializeUser((user, cb) => {
    cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
    userModel.findById(id, cb)
})

module.exports = {registerStrategy, loginStrategy};