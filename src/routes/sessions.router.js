import { Router } from "express"
import { UsersManager } from "../dao/usersManager.js"

import { createHash, validatePassword } from "../utils.js"

export const routerSession = Router()

let usersManager = new UsersManager()

routerSession.post('/register', async (req, res)=> {
    let { name, email, password } = req.body
    if ( !name || !email || !password ) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error: 'Complete todos los datos.'})
    }
    let exist = await usersManager.getBy({email})
    if (exist) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error: `Este usuario ya existe: ${email}`})
    }
    password = createHash(password)
    console.log('psw reg: ', password)
    try {
        //let newUser = await usersManager.createUser( { name, email, password } )
        await usersManager.createUser( { name, email, password } )

        res.setHeader('Content-Type', 'application/text')
        //return res.status(201).json({payload: "Usuario creado", newUser})
        return res.redirect('http://localhost:8080/login')

    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error: `Error en el servidor. Error de registro: ${err.message}`})
    }
})

routerSession.post('/login', async (req, res)=> {
    let { email, password } = req.body
    if ( !email || !password ) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error: 'Complete todos los datos.'})
    }
    let existUser = await usersManager.getBy({email})

    if (!existUser) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(401).json({error: `Email inválido: ${email}`})
    }
    // login admin
    const eCoder = "adminCoder@coder.com"
    const psw = "adminCod3r123"
    if (email === eCoder && password === psw) {
        existUser.role = 'admin'
    }
    
    // Verificar la contraseña bcrypt
    if (!validatePassword(existUser, password)) res.status(401).json({error: "Contraseña incorrecta"})
    
    delete existUser.password
    req.session.existUser = existUser
    try {
        res.setHeader('Content-Type', 'application/text')
        /* return res.status(200).json({message: `Login correcto`, existUser}) */
        return res.redirect('http://localhost:8080/products')
    } catch (err) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({error: `Error en el servidor. Error: ${err.message}`})
    }
})

routerSession.get("/logout", (req, res) => {
    req.session.destroy(e => {
            if ( e ) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(500).json({
                    error: "Error inesperado. Intente más tarde",
                    detail: `${e.message}`
                }
            )
        }
    })
    res.setHeader('Content-Type', 'application/text')
    //res.status(200).json({ message: "Logout exitoso" })
    return res.redirect('http://localhost:8080/login')

})