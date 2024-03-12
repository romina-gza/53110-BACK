import express from 'express'
import handlebars from 'express-handlebars'
import path from "path"
import { Server } from 'socket.io'

import __dirname from './utils.js'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartsRouter } from './routes/carts.router.js'
import { router as viewsRouter } from './routes/views.router.js'

const PORT = 8080

const app = express()
let io;

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )

app.use( express.static( path.join( __dirname, "public" ) ) )

//config handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
const midlewareSocket = (req, res, next) => {
    req.io = io
    next()    
}
app.use('/', midlewareSocket, viewsRouter)

// para paginas no encontradas
app.get('*', (req,res)=> {
    res.status(404).send('404 Error Not Found')
})

const http = app.listen(PORT, (req,res)=>{
    console.log('escuchando')    
})

io = new Server(http)

io.on('connection', socket =>{
    console.log('nuevo cliente conectado', 'SOCKET es: ', socket.id)
    io.on('nuevoProducto', data=>{
        console.log('data es:', data)
    })
})