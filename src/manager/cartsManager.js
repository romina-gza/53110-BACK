import fs from 'fs'

/* cada objeto representa un producto en el array de products */
export default class CartsManager {
    constructor( file ){
        this.path = file
    }

    async createCart(product) {
        try {
            let listCarts = await this.getCarts()

            // id autogenerado
            /* IGNORAR
            Como el file.json puede llegar a tener productos sin id se pueden agregar más condicionales.
            */
            let id = 1
            let lengthListCarts = listCarts.length    
            if (lengthListCarts > 0 ) id = listCarts[lengthListCarts - 1].id + 1
            //array de productos
            console.log('product:', product)
            let saveProduct = { id, product: [ /* ...product */ ] }
            listCarts.push(saveProduct)

            //guardar producto
            await fs.promises.writeFile(this.path,JSON.stringify(listCarts, null, 4))
        } catch (err) {
            return err
        }
    }
    
    async getCarts () {
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8')

            return JSON.parse(data)
        } catch (err) {
            return []
        }
    }

    async getcartsById(id) {
        try {
            let cartProducts = await this.getCarts()
            let idExist = cartProducts.find(obj => obj.id == id )
            if (idExist) {
                console.log('existe:', idExist)
                return idExist  
            }
           // else throw new Error(`El id: ${id} no existe.`)
        } catch (err) {
            return err
        }
    }

    async addToCart(cid, pid) {
        try {
            //let filterIDCart = await this.getcartsById(cid)
            // buscar por indice
            let listCarts = await this.getCarts()
            let indexId = listCarts.findById(obj => obj.id == cid.id)
            console.log('index id cartManagr ', indexId)
            //actualizar
            listCarts[indexId].product = pid
            await fs.promises.writeFile(this.path,JSON.stringify(listCarts, null, 4))
        } catch (err) {
            return err
        }
    } 
}


