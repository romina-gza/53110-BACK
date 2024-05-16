import passport from "passport"
import local from "passport-local"
import github from "passport-github2"

import { UsersManager } from "../dao/usersManager.js"
import { createHash, validatePassword } from "../utils.js"

const usersManager = new UsersManager()

export const initializesPassport = () => {
    passport.use(
        'register',
        new local.Strategy(
            {
                usernameField: 'email',
                passReqToCallback: true
            },
            async ( req, username, password, done ) => {
                try {
                    let { name } = req.body
                    if ( !name ) {
                    return done(null, false)
                    }
                    let exist = await usersManager.getBy({ email: username });
                    if (exist) {
                    return done(null, false)
                    }
                    password = createHash(password);

                    let newUser = await usersManager.createUser({ name, email: username , password });
                    return done(null, newUser)
                } catch (err) {
                    return done(err)
                }
            }
        )
    )

    passport.use(
        'login',
        new local.Strategy(
            {
                usernameField: "email"
            },
            async ( username, password, done ) => {
                try {
                    
                    let existUser = await usersManager.getBy({email: username})
                
                    if (!existUser) {
                        return done(null, false)
                    }
                    // login admin
                    const eCoder = "adminCoder@coder.com"
                    const psw = "adminCod3r123"
                    if (username === eCoder && password === psw) {
                        existUser.role = 'admin'
                    }
                    
                    // Verificar la contraseña bcrypt
                    if (!validatePassword(existUser, password)) {
                        return done(null, false)
                    }
                    return done(null, existUser)
                } catch (err) {
                    return done(err)
                }
            }
        )
    )

    passport.use(
        'github',
        new github.Strategy(
            {
                clientID: 'Iv23liM5naHfqjpYa9xu',
                clientSecret: '38affedd579ba26454b55f2c4699d05d2a723e76',
                callbackURL: 'http://localhost:8080/api/sessions/sessionsGithub'
            },
            async function( accessToken, refreshToken, profile, done ) {
                try {
                    console.log('profile: ', profile)
                    let name = profile._json.name
                    let email = profile._json.email

                    let existUser = await usersManager.getBy({email})
                    
                    if (!existUser) {
                        await usersManager.createUser({name, email, profileGitHub: profile})
                    }
                    return done(null, existUser)
                } catch (err) {
                    return done(err)
                }
            }
        )
    )

    // paso add.. solo si trabajo con session serealizacion y descerealización
    passport.serializeUser( ( user, done ) => {
        return done(null, user._id)
    })
    passport.deserializeUser( async (id, done) => {
        let user = await usersManager.getBy({_id: id})
        return done(null, user)
    } )
}