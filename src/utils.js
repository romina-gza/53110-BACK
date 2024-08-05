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

const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'src/uploads/others';

        // Asigna la carpeta correspondiente según el tipo de archivo (fieldname)
        switch(file.fieldname) {
            case 'profile':
                folder = 'src/uploads/profiles';
                break;
            case 'product':
                folder = 'src/uploads/products';
                break;
            case 'documents':
                folder = 'src/uploads/documents';
                break;
        }

        // Asegura que la carpeta exista antes de guardar el archivo
        ensureDirExists(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // Genera un nombre único para el archivo basado en el timestamp y el nombre original
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
});

// Exporta la configuración de Multer
export const upload = multer({ storage: storage });

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
