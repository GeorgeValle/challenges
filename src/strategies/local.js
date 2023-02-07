const local = require ('passport-local');
const passport = require ('passport')
const { userModel } = require ('../daos/userDao')
const { createHash, isValid } = require ('../utils/bcrypt')
const {errorLogger,infoLogger,consoleLogger,} = require('../utils/loggers')


const LocalStrategy = local.Strategy;

const initializePassport = ()=>{
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                try {
                    let user = await userModel.findOne({ username: username })
                    if (user){//error, data
                        errorLogger.error(`Ya existe el usuario: ${username}`) 
                        return done(null, false) 
                        }

                        const hash = createHash(password)
                        const newUser = await userModel.create({username, password: hash})
                        consoleLogger.info(newUser)
                        infoLogger.info(`Se ha creado el nuevo usuario: ${newUser.username}`)
                        return done(null, newUser)
                    } catch (error) {
                        errorLogger.error(error)
                        return done(error)
                    }
            })  
    )

    passport.use(
        'login',
        new LocalStrategy(
            async(username, password, done) => {
                try {
                    let user = await userModel.findOne({ username: username })
                    if (!user) {
                        errorLogger.error(`No se encontró al usuario ${username}`)
                        return done(null, false)
                    }
                    if (!isValid(user, password)){ 
                        errorLogger.error(`Password incorrecto `)
                        return done(null, false, {message: 'Wrong password'})
                    }
                    return done(null, user)
                } catch(err) {
                    errorLogger.error(err)
                    return done(err)
                }
            }
        )
    )


}




//  } new LocalStrategy(async (username, password, cb) => {
//     try {
//         const user = await userModel.findOne({username})
//         if(user){ return cb(null, false, {message: 'User already exist'})}

//         const hash = createHash(password)
//         const newUser = await userModel.create({username, password: hash})

//         console.log(newUser)
//         return cb(null, newUser)
//     } catch (error) {
//         return cb(error)
//     }
// })




    

// const loginStrategy = new LocalStrategy(async (username, password, cb) => {
//     try {
//         const user = await userModel.findOne({username})
//         if(!user){ return cb(null, false, { message: 'User does not exist' })}

//         if(!isValid(user, password)){ return cb(null, false, { message: 'Wrong password' })}
        
//         return cb(null, user)
//     } catch (error) {
//         return cb(error)
//     }
// })

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    userModel.findById(id, done)
})

module.exports = {initializePassport}