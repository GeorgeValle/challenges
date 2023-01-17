import passport from 'passport';
import local from 'passport-local';
import { userModel } from '../models/Users.js';
import { createHash, isValid } from '../utils/bcrypt.js';

const LocalStrategy = local.Strategy;

export const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                try {
                    let user = await userModel.findOne({ username: username })
                    if (user) return done(null, false) //error, data
                    const newUser = {
                        username,
                        password: createHash(password),
                        name: req.body.name,
                        address: req.body.address,
                        age: req.body.age,
                        phone: req.body.phone,
                        avatar: req.body.avatar
                    }
                    try {
                        let result = await userModel.create(newUser)
                        return done(null, result)
                    } catch (err) {
                        done(err)
                    }
                } catch(err) {
                    done(err)
                }
            }
        )
    )


    passport.use(
        'login',
        new LocalStrategy(
            async(username, password, done) => {
                try {
                    let user = await userModel.findOne({ username: username })
                    if (!user) {return done(null, false, {message: 'User not found'})}
                    if (!isValid(user, password)) return done(null, false, {message: 'Wrong password'})
                    return done(null, user)
                } catch(err) {
                    return done(err)
                }
            }
        )
    )

    //va a identificar por el id en la base de datos mongo, va a enlazar al usaurio con su id
    //este solo es data y guarda solo el id
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    //a traves de un id va a conectar y saber cual es el usuario,
    // este con el id, pueda consultar el resto de los datos que tiene la base de datos.
    passport.deserializeUser((id, done) => {
        userModel.findById(id, done)
    })

}

// const registerStrategy = new LocalStrategy(async (email, password,name, address, age, phone, avatar, cb) => {
//     try {
//         const user = await userModel.findOne({email})
//         if(user){ return cb(null, false, {message: 'User already exist'})}

//         const hash = createHash(password)
//         const newUser = await userModel.create({email, password: hash, name, address, age, phone, avatar})

//         console.log(newUser)
//         return cb(null, newUser)
//     } catch (error) {
//         return cb(error)
//     }
// })

// const loginStrategy = new LocalStrategy(async (email, password, cb) => {
//     try {
//         const user = await userModel.findOne({email})
//         if(!user){ return cb(null, false, { message: 'User does not exist' })}

//         if(!isValid(user, password)){ return cb(null, false, { message: 'Wrong password' })}
        
//         return cb(null, user)
//     } catch (error) {
//         return cb(error)
//     }
// })

// passport.serializeUser((user, cb) => {
//     cb(null, user._id)
// })

// passport.deserializeUser((id, cb) => {
//     userModel.findById(id, cb)
// })

// export {registerStrategy, loginStrategy};