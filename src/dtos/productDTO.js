module.exports = class ProductDTO {
    constructor(product) {
        this.id = product.id
        this.description = `${product.category} ${product.name}`
    }
}