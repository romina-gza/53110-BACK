import { config } from "../config/config.js"
import { logger } from "../utils.js"
export let DAO = {}

switch (config.PERSISTENCE) {
    case "MONGO":
        await import("./useMongoDB.js")
        DAO.UsersDAO = (await import("./UsersMongoDAO.js")).UsersMongoDAO
        DAO.CartsDAO = (await import("./cartsMongoDAO.js")).CartsMongoDAO
        DAO.ProductsDAO = (await import("./ProductsMongoDAO.js")).ProductsMongoDAO
        
        break;

    default:
        logger.info('Persistencia configurada..')
        process.exit()
        break;
}