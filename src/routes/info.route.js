const express = require('express');
const route = express.Router();


route.get('/info', (req, res) => {
    
        res.render('info')
    }
)

route.get('/api/randoms', (req, res) => {

    }
)

module.exports =route;