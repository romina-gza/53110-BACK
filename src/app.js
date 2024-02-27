import express from 'express'

import { router as productsRouter } from './routes/products.router.js'

const PORT = 8080


const app = express()

app.use( express.json() )
app.use( express.urlencoded({ extended: true }) )


app.use('/api/products', productsRouter )


app.get('/', (req,res)=> {
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send('<h1>Hello world</h1>')
})

app.get('*', (req,res)=> {
    res.status(404).send('404 Error Not Found')
})

app.listen(PORT, (req,res)=>{
    console.log('escuchando')    
})

