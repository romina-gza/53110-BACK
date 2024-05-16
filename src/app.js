import express from 'express'
import handlebars from 'express-handlebars'
import path from "path"
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
import { initializesPassport } from './config/passport.config.js'
import passport from 'passport'

import __dirname from './utils.js'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartsRouter } from './routes/carts.router.js'
import { router as viewsRouter } from './routes/views.router.js'

import MessagesManager from './dao/messagesManager.js'
import { chatRouter } from './routes/chat.router.js'
import { routerSession } from './routes/sessions.router.js'

const PORT = 8080

const app = express()
let io;

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )

app.use( express.static( path.join( __dirname, "public" ) ) )
app.use(session(
    {
        secret: "topSecret",
        resave: true,
        saveUninitialized: true,
        store: ConnectMongo.create(
            {
                mongoUrl: "mongodb+srv://rominacelestegza:alex41701647@back53110.snwicy3.mongodb.net/?retryWrites=true&w=majority&appName=back53110&dbName=ecommerce",
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


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', routerSession)

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
const connection = async () =>{
    try {
        await mongoose.connect("mongodb+srv://rominacelestegza:alex41701647@back53110.snwicy3.mongodb.net/?retryWrites=true&w=majority&appName=back53110&dbName=ecommerce")
        console.log('Conectado con MongoDB')
    } catch (err) {
        console.log("Fallo en la conexion:", err.message)
    }
}
connection()

// socket
io = new Server(http)
const messagesManager = new MessagesManager()
io.on('connection', socket => {
    console.log('nuevo cliente conectado', 'SOCKET es: ', socket.id)
    
    socket.on('newProduct', data=> {
        console.log('data de form es:', data)
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
