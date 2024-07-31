import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import winston from 'winston'
import { config } from './config/config.js'

const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )

export default __dirname

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))    

export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password)
const customLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
}

// produccion
const transportFile = new winston.transports.File({
    level: "error",
    filename: "./src/logs/errors.log",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
})

//desarrollo
const transportConsole = new winston.transports.Console(
    {
        level: "debug", 
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({
                colors: { 
                    debug: 'blue',
                    http: 'magenta bold',
                    info: 'blue bold',
                    warning: 'yellow',
                    error: 'red',
                    fatal: 'magenta'}            
            }),
            winston.format.simple()
        )
    }
)

export const logger = winston.createLogger({
    levels: customLevels,
    transports: config.MODE == "production"
        ? [transportFile] : [transportConsole, transportFile] 
})

export const mdwLogger=(req, res, next)=>{
    req.logger=logger
    next()
}
