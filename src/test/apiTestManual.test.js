
const axios = require ('axios')

async function getProducts(){
    try {
        return await axios.request({
            baseURL: 'http://localhost:8080',
            url: '/product',
            method: 'GET',
            
        })
        //console.log(response.data)
    } catch(err) {
        console.log(err.message)
    }

}

async function addProduct(){
    try{
    return await axios.post('/product',{
        name: 'Ropero',
        category: 'Mueble',
        price: 25000
    })
}catch(err) {console.log(err.message)}

}

async function getProductById(){
    try{
        return await axios.get('/product/0')
    }catch(err) {console.log(err.message)}

}
async function removeProductById(){
    try{
        return await axios.delete('/product/0')
    }catch(err) {console.log(err.message)}

}
async function deleteAllProducts(){
    try{
        return await axios.delete('/product/all')
    }catch(err) {console.log(err.message)}

}


(async () => {
    try{
Promise.all([getProducts,addProduct,getProductById,removeProductById,deleteAllProducts])
.then(function (results){
    console.log("getAll = "+ results[0]);
    console.log( "addP = "+results[1]);
    console.log( "getP = "+results[2]);
    console.log( "deleteP = "+results[3]);
    console.log( "deleteAll = "+results[4]);
})
    }catch(err){console.log(err)}

})()
