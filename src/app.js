import express from 'express'
import handlebars from 'express-handlebars'
import path from "path"
import { Server } from 'socket.io'
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
import { initializesPassport } from './config/passport.config.js'
import passport from 'passport'
import cors from 'cors'

import __dirname from './utils.js'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartsRouter } from './routes/carts.router.js'
import { router as viewsRouter } from './routes/views.router.js'

import MessagesManager from './dao/messagesManager.js'
import { chatRouter } from './routes/chat.router.js'
import { sessionsRouter } from './routes/sessions.router.js'
import { config } from './config/config.js'
import { productsServices } from './services/products.service.js'
import cartIdMiddleware from './middleware/cart.js'

const PORT = config.PORT

const app = express()
let io;

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use(cors({}))

app.use( express.static( path.join( __dirname, "public" ) ) )
app.use(session(
    {
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: ConnectMongo.create(
            {
                mongoUrl: config.MONGO_URL,
                ttl: 6000
            }
        )
    }
))
initializesPassport()
app.use(passport.initialize())
app.use(passport.session())
//config handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))
app.use(cartIdMiddleware)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)

const midlewareSocket = (req, res, next) => {
    req.io = io
    next()    
}
app.use('/', midlewareSocket, viewsRouter)

// CHAT
app.use('/chat', chatRouter)

// para paginas no encontradas
app.get('*', (req,res)=> {
    res.status(404).send('404 Error Not Found')
})

const http = app.listen(PORT, (req,res)=>{
    console.log('escuchando')    
})
// Conexion a mongo db


// socket
io = new Server(http)
const messagesManager = new MessagesManager()
io.on('connection', socket => {
    console.log('nuevo cliente conectado', 'SOCKET es: ', socket.id)
    
    socket.on('newProduct', async data=> {
        console.log('data de form ess:', data)
        try {    //new oia
            let lastCode = await productsServices.getLastProductCode();
            let code = lastCode + 1;
            data.code = code;
            
            if (data.thumbnails[0] == '') {
                data.thumbnails = ["https://craftypixels.com/placeholder-image/250x200/7030f0/2d1b52&text=250x200"];
            } 
            let newProd = await productsServices.createProducts(data)
            console.log('nuevo producto: ', newProd)
            io.emit('nuevoProducto', newProd)
        } catch (err) {
            console.log('el err:' , err)
        }
    })
    
    socket.on("presentation", async user => {
        console.log(user)
        socket.emit("history", await messagesManager.getMessages())
        socket.broadcast.emit("newMember", user)
    })
    
    socket.on("message", async (user, message) => {
        await messagesManager.saveMessages({user,message})
        io.emit("newMessage", user, message)
    })
})
