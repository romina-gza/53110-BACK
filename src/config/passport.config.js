import passport from "passport"
import local from "passport-local"
import github from "passport-github2"

import { UsersManager } from "../dao/usersManager.js"
import { createHash, validatePassword } from "../utils.js"
import { config } from "./config.js"
import UsersController from "../controller/users.controller.js"

//const usersManager = new UsersManager()

export const initializesPassport = () => {
    passport.use(
        'register',
        new local.Strategy(
            {
                usernameField: 'email',
                passReqToCallback: true
            },
            UsersController.registerUser
        )
    )

    passport.use(
        'login',
        new local.Strategy(
            {
                usernameField: "email"
            },
            UsersController.loginUser
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
            UsersController.loginWithGithub
        )
    )

    // paso adicional; solo si trabajo con session serealizacion y descerealización
    passport.serializeUser( ( user, done ) => {
        return done(null, user._id)
    })
    passport.deserializeUser( 
        UsersController.deserializeUser
    )
}