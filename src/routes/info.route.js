const express = require('express');
const route = express.Router();

const yargs = require('yargs');

// argumentos de entrada + 
// nombre de la plataforma + process.plataform
// version de Node.js + process.version
// memoria total reservada rss
// path de ejecucion + process.execPath
// process Id + process.pid
// carpeta del proyecto + process.cwd()

route.get('/info', (req, res) => {
        // res.render('info')
        res.send({
            argumentos: yargs.argv,    
            plataforma: process.platform,
            node_version: process.version,
            memoria_rss: process.memoryUsage().rss,
            path: process.execPath,
            pid: process.pid, 
            carpeta: process.cwd()
        })  
    }
)


module.exports =route;