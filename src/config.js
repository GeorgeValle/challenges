const dotenv = require ('dotenv')
dotenv.config()

module.exports =  {
    app: {
        persistence: process.env.PERSISTENCE
    }
}