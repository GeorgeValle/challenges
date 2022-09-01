const Contenedor = require('./Contenedor.js');
const contenedor = new Contenedor();

let product={
    title:"Don Quijote de la Mancha",
    price: 1600,
    thumbnail: "http://MiguelDeCervantes.com/images/",
}

contenedor.save(product).then(result => console.log(result));
//contenedor.getById(2).then(result => console.log(result));
//contenedor.getAll().then(result => console.log(result));
//contenedor.deleteById(2).then(result => console.log(result));
//contenedor.deleteAll().then(result => console.log(result));
