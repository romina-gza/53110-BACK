import { config } from "../config/config.js"
export let DAO = {}

switch (config.PERSISTENCE) {
    case "MONGO":
        await import("./useMongoDB.js")
        DAO.UsersDAO = (await import("./UsersMongoDAO.js")).UsersMongoDAO
        DAO.CartsDAO = (await import("./cartsMongoDAO.js")).CartsMongoDAO
        DAO.ProductsDAO = (await import("./ProductsMongoDAO.js")).ProductsMongoDAO
        
        break;

    case "FS":
        DAO.UsersDAO = (await import("./usersFsDAO.js")).UsersFsDAO
        DAO.CartsDAO = (await import("./cartsFsDAO.js")).CartsFsDAO
        DAO.ProductsDAO = (await import("./productFsDAO.js")).ProductsFsDAO
        break;

    default:
        console.log('Persistencia configurada..')
        process.exit()
        break;
}