const Contenedor = require('./Contenedor.js');
const contenedor = new Contenedor();

let product={
    title:"Cien años de Soledad",
    price: 500,
    thumbnail: "http://GabrielGarciaMarquez.com/images/"
}

contenedor.save(product).then(result => console.log(result));
//contenedor.getById(2).then(result => console.log(result));
//contenedor.getAll().then(result => console.log(result));
//contenedor.deleteById(1).then(result => console.log(result));
// contenedor.deleteAll().then(result => console.log(result));
