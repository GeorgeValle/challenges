import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import product from './services/products.js' 

const app = express()
app.listen(8080, () => console.log('Server Online'))

let schema = buildSchema(`
    type Products{
        id: Int
        name: String
        description: String
        price: Float
        stock: Int
    }
    type Query{
        products: [Products]
        productById(id:Int): Products
    }
    type Mutation{
        createProduct(name:String, description:String, price:Float, stock:Int): Products
        deleteAllProducts: [Products]
        deleteOneProduct(id:Int): [Products]
        modifyProduct(id:Int, name:String, description:String, price:Float, stock:Int): Products
    }
`)

const root = {
    products: () => product.getProducts(),
    productById: (id) =>product.getById(id),
    createProduct: (data) => product.createProduct(data),
    deleteAllProducts: () => product.deleteAllProducts(),
    modifyProduct: (data) => product.modifyProduct(data),
    deleteOneProduct: (id) => product.deleteOneProduct(id)
}

app.use('/test', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))