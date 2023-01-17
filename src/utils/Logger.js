
import log4js from 'log4js'

log4js.configure({
    appenders: {
        consola: { type: "console" },
        debugFile: { type: "file", filename: './debug.log'}
    },
    categories: {
        default: {
            appenders: ["consola"], level: "all"
        },
        DEV: {
            appenders: ["debugFile"], level: "DEBUG"
        }
    }
})

const logger = log4js.getLogger('DEV')

export {logger}

