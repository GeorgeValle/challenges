const express = require('express');
const route = express.Router();

const yargs = require('yargs');

// argumentos de entrada + 
// nombre de la plataforma + process.plataform
// version de Node.js + process.version
// memoria total reservada rss
// path de ejecución + process.execPath
// process Id + process.pid
// carpeta del proyecto + process.cwd()

route.get('/info', (req, res) => {
        // res.render('info')
        res.render('info', {
            argvs: process.argv.slice(2),
            platform: process.platform,
            node: process.version,
            memory: process.memoryUsage().rss,
            path: process.execPath,
            pid: process.pid,
            folder: process.cwd(),
            cpus: processor_count
        })
    }
)


module.exports =route;