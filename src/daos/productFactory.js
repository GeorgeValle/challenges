const config = require ('../config')

module.exports = class ProductFactory {
    static getPersistence = async () => {
        switch (config.app.persistence) {
            case "ARRAY":
                let { default: ProductDaoArray } = await require('./productDaoArray')
                // let UsersDaoArray = await import('./userDaoArray.js')
                return new ProductDaoArray()
            case "FILE":
                let { default: ProductDaoFile } = await require('./productDaoFile')
                return new ProductDaoFile()
            // case "DB":
            //     let { default: UsersDaoDB } = await import('./userDaoDB.js')
            //     return new UsersDaoDB()
        }
    }
}