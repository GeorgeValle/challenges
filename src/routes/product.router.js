const express = require('express')
const router = express.Router()

const mysql = require('../options/mysql.config')

const Manager = require('../controllers/product.manager')
const manager = new Manager(mysql,products)

router.get('/', (req, res) => {
    let result = manager.findAll()
    res.send(result)
})

router.get('/:id', (req, res) => {
    let result = manager.findById(req.params.id)
    if (!result) return res.send({error: 'product was not found'})
    res.send(result)
})

router.post('/', (req, res) => {
    try{
    if (!req.body.title || !req.body.price || !req.body.thumbnail) return res.send({error: 'data is required'})
    const product = ({title, price, thumbnail}=req.body);
    let result = manager.create(product)
    res.send(result)
    }catch{(err=>console.log(err))}
    finally{(()=>mysql.destroy())}

})

router.put('/:id', (req, res) => {
    try{
    if (!req.body.title || !req.body.price || !req.body.thumbnail) return res.send({error: 'data is required'})
    const product = ({title, price, thumbnail}=req.body)
    let result = manager.update(req.params.id, product)
    if (!result) return res.send({error: 'product was not found'})
    res.send(result)
}catch{(err=>console.log(err))}
finally{(()=>mysql.destroy())}
})

router.delete('/:id', (req, res) => {
    try{
    let result = manager.delete(req.params.id)
    res.send(result)
}catch{(err=>console.log(err))}
finally{(()=>mysql.destroy())}

})

module.exports = router