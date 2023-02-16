const express = require('express');
const route = express.Router();

const {getInfo} = require('../controllers/info.manager')

const yargs = require('yargs');

route.get('/info', getInfo
)


module.exports =route;