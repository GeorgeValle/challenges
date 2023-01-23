const log4js = require ('log4js')

log4js.configure({
    appenders: {
        consola: { type: "console" },
        warnFile: { type: "file", filename: './warn.log'},
        errorFile:{type: "file", filename: './error.log'},
        infoFile: { type: "file", filename: './info.log'}
    },
    categories: {
        default: {
            appenders: ["consola"], level: "all"
        },
        WARN: {
            appenders: ["warnFile"], level: "DEBUG"
        },
        ERR: {
            appenders: ["errorFile"], level: "ERROR"
        },
        INFO:{
            appenders: ["infoFile"], level: "DEBUG"
        }
    }
})

const consoleLogger = log4js.getLogger('default')
const warnLogger = log4js.getLogger('WARN')
const errorLogger = log4js.getLogger('ERR')
const infoLogger = log4js.getLogger('INFO')

module.exports = {
        consoleLogger,
        warnLogger,
        errorLogger,
        infoLogger
        }
