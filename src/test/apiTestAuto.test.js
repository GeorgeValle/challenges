const  supertest = require ('supertest')
const  { expect } = require ('chai')

const request = supertest('http://localhost:8080')

describe('test API', () => {
    describe('GET', () => {
        it('La petición debería retornar status 200', async () => {
            let res = await request.get('/product')
            expect(res.status).to.equal(200)
        })
    })

    describe('POST', () => {
        it('Debe poder guardar un producto', async () => {
            let product = {
                name: 'Ropero',
                category: 'Mueble',
                price: 25000
            }
            let res = await request.post('/product').send(product)
            expect(res.status).to.equal(200)
            const resBody = res.body
            expect(resBody).to.include.keys('name', 'category', 'price', 'id')
        })
    })

    describe('test API By ID', () => {
        describe('GET by Id', () => {
            it('La petición By ID debería retornar status 200', async () => {
                let id = 1;
                let res = await request.get(`/product/${id}`)
                expect(res.status).to.equal(200)
            })
        })
    })

    describe('test Delete API By ID', () => {
        describe('DELETE by Id', () => {
            it('La petición delete By ID debería retornar status 200', async () => {
                let id = 1;
                let res = await request.delete(`/product/${id}`)
                expect(res.status).to.equal(200)
            })
        })
    })

    describe('test Delete ALL API ', () => {
        describe('DELETE ALL', () => {
            it('La petición delete All debería retornar status 200', async () => {
                let res = await request.delete(`/product/all`)
                expect(res.status).to.equal(200)
            })
        })
    })

    
})