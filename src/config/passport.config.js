import passport from "passport"
import local from "passport-local"
import github from "passport-github2"

import { UsersManager } from "../dao/usersManager.js"
import { createHash, validatePassword } from "../utils.js"
import { config } from "./config.js"

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
                    let { first_name } = req.body
                    if ( !first_name ) {
                    return done(null, false)
                    }
                    let exist = await usersManager.getBy({ email: username });
                    if (exist) {
                    return done(null, false)
                    }
                    password = createHash(password);

                    let newUser = await usersManager.createUser({ first_name, email: username , password });
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
                    const eCoder = config.EUS_AD
                    const psw = config.PA_AD
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
                clientID: config.GITHUB_CID,
                clientSecret: config.GITHUB_CS,
                callbackURL: config.GITHUB_CURL
            },
            async function( accessToken, refreshToken, profile, done ) {
                try {
                   // console.log('profile: ', profile)
                    let first_name = profile._json.name
                    let email = profile._json.email

                    let existUser = await usersManager.getBy({email})
                    
                    if (!existUser) {
                        await usersManager.createUser({first_name, email, profileGitHub: profile})
                    }
                    return done(null, existUser)
                } catch (err) {
                    return done(err)
                }
            }
        )
    )

    // paso adicional; solo si trabajo con session serealizacion y descerealización
    passport.serializeUser( ( user, done ) => {
        return done(null, user._id)
    })
    passport.deserializeUser( async (id, done) => {
        let user = await usersManager.getBy({_id: id})
        return done(null, user)
    } )
}