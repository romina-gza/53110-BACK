import { fileURLToPath } from 'url'
import fs from 'fs'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import multer from 'multer'
import winston from 'winston'
import { config } from './config/config.js'

const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )

export default __dirname

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))    

export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password)

// Multer 
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/others'

        if (file.fieldname === 'profile') {
            folder = 'uploads/profiles'
        } else if (file.fieldname === 'product') {
            folder = 'uploads/products'
        } else if (file.fieldname === 'document') {
            folder = 'uploads/documents'
        }

        // Asegura que la carpeta exista
        ensureDirExists(folder)
        cb(null, folder)
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    }
})

export const upload = multer({ storage: storage })

// logger
const customLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

// produccion
const transportFile = new winston.transports.File({
    level: "info",
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
                    fatal: 'magenta bold'}            
            }),
            winston.format.simple()
        )
    }
)

export const logger = winston.createLogger({
    levels: customLevels,
    transports: config.MODE == "production"
        ? [transportFile] : [transportConsole] 
})

export const mdwLogger=(req, res, next)=>{
    req.logger=logger
    next()
}
