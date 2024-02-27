import fs from 'fs'
//import path from 'path'
//import __dirname from '../utils.js'

export default class ProductManager {
    constructor ( file ) {
        this.path = file
        //this.path = path.join(__dirname, file)
    }    

    addProducts = async ( title, description, thumbnails, price, stock, code, status, category ) => {
        try {
            // validar no repetir code 
            let listProducts = await this.getProducts()
            // console.log('list Products: ', listProducts)
            
            // let codeRepeat = listProducts.find(c => c.code === code)
            // if (codeRepeat) {
            //     throw new Error(`El codigo : ${codeRepeat.code} ya existe. Intenta otro codigo.`)
            // }    
            
            // campos obligatorios 
            /* if (!title || !description || !thumbnails || !price || !stock || !code || !status ) {
                // console.log('todos los campos deben ser completados.')
                throw new Error('todos los campos son obligatorios!!')
            }    */
            
            // id incrementable
            let id = 1
            let lengthListProducts = listProducts.length    
            if (lengthListProducts > 0 ) id = listProducts[lengthListProducts - 1].id + 1
            
            // guardar producto
            const product = { id ,title, description, thumbnails, price, stock, code, status, category }
            listProducts.push(product)
    
            return await fs.promises.writeFile(this.path, JSON.stringify(listProducts, null, 5), 'utf-8')
        } catch (err) {
            return err
        }
    }

    getProducts = async () => {
        try {
            let data = await fs.promises.readFile( this.path, 'utf-8' )
            return JSON.parse(data)
        } catch (err) {
            return []
        }
    }

    getProductsById = async (id) => {
        try {
            let listProducts = await this.getProducts()
            let idExist = listProducts.find(obj => obj.id === id )
            if (idExist) {
                console.log('existe:', idExist)
                return idExist  
            }
            else throw new Error(' no existe el id: ', id)
        } catch (err) {
            console.log("hubo un error al buscar el id", id)
            return err
        }
    }

    updateProducts = async ( id, newProducts ) => {
        try {
            let listProducts = await this.getProducts()

            let findIndex = listProducts.findIndex(obj => obj.id === id)
            if (findIndex !== -1) {
                listProducts[findIndex] = { ...listProducts[findIndex], ...newProducts }
                
                await fs.promises.writeFile( this.path, JSON.stringify( listProducts, null, 5 ), 'utf-8' )
            } else {
                throw new Error('El id no es válido o no existe.')
            }
        } catch (err) {
            return err
        }
    }

    deleteProducts = async (id) => {
        try {
            let listProducts = await this.getProducts()
            listProducts = listProducts.filter(obj => obj.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(listProducts, null, 5),'utf-8')

        } catch (err) {
            return err
        }
    }

}

// let enero = new ProductManager('test.json')
// enero.getProducts()
// enero.getProductsById(3)
// enero.deleteProducts(2)
// enero.updateProducts(7, { price: 100000, stock: 125 , thumbnails: 'NUEVO link ' } )

// //enero.addProducts('title','description here', 'link here', 12 ) 
// enero.addProducts('title','description here', 'link here', 12,13,19) 
