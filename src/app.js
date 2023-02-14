import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

const app = express()
app.listen(8080, () => console.log('Server Up'))

let clients = [
    {
        id: 1,
        name: 'Alex',
        phone: '123'
    },
    {
        id: 2,
        name: 'Shakira',
        phone: '456'
    },
    {
        id: 3,
        name: 'Piqué',
        phone: '789'
    },
]
let counter = 4

let schema = buildSchema(`
    type Client{
        id: Int
        name: String
        phone: String
    }
    type Query{
        clients: [Client]
        clientById(id:Int): Client
    }
    type Mutation{
        addClient(name:String, phone:String): Client
    }
`)

const root = {
    clients: () => clients,
    clientById: (data) => {
        for (let i=0; i<clients.length; i++) {
            if (clients[i].id === data.id) return clients[i]
        }
        return {}
    },
    addClient: (data) => {
        let client = { 'id': counter, 'name': data.name, 'phone': data.phone}
        clients.push(client)
        counter++
        return client
    }
}

app.use('/test', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))