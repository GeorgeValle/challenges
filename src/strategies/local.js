import LocalStrategy from 'passport-local';
import passport from 'passport';
import { userModel } from '../models/Users';
import { createHash, isValid } from '../utils/bcrypt';

const registerStrategy = new LocalStrategy(async (email, password,name, address, age, phone, avatar, cb) => {
    try {
        const user = await userModel.findOne({email})
        if(user){ return cb(null, false, {message: 'User already exist'})}

        const hash = createHash(password)
        const newUser = await userModel.create({email, password: hash, name, address, age, phone, avatar})

        console.log(newUser)
        return cb(null, newUser)
    } catch (error) {
        return cb(error)
    }
})

const loginStrategy = new LocalStrategy(async (email, password, cb) => {
    try {
        const user = await userModel.findOne({email})
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

export {registerStrategy, loginStrategy};