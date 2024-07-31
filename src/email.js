import nodemailer from 'nodemailer'
import { config } from './config/config.js'

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        port: 587,
        auth: {
            user: config.US_EMAIL,
            pass: config.PSW_EMAIL
        }
    }
)

export const sendEmail = (to, name, cid, purchaseDatetime) => {
    return transporter.sendMail(
        { 
            from: `HosPet ${config.US_EMAIL}`,
            to: `${to}`,
            subject: "Test de envío simple HOSPET",
            html: `
                <div style="width:100%;background-color: #7030f0;">
                    <h1 style="color: #ffff;padding:2.8rem;font-family: 'Mochiy Pop One'; font-weight: 600;text-align:center;">HosPet</h1>
                </div>
                <h2 style="padding-left:1.7rem;"><strong>¡Muchas gracias, ${name}!</strong></h2>

                <p style="font-size:1rem;font-weight:400;">Tu pedido fue procesado.</p>
                    <h3 style="font-size:1rem;font-weight:400;text-align:center">
                        <strong>Te dejamos información de tu compra</strong>
                    </h3>

                <div style="width:100%;padding:7px;text-align:center;background-color: gray">
                    <h4 style="color: #ffff;font-weight:400"><strong>Datos generales</strong></h4>                
                </div>
    
                <p style="font-size:1rem;font-weight:400;padding-left:1.7rem;"><strong>Fecha del pedido:</strong> ${purchaseDatetime}</p>
                <p style="font-size:1rem;font-weight:400;padding-left:1.7rem;"><strong>Cliente:</strong> ${name}</p>
                <p style="font-size:1rem;font-weight:400;padding-left:1.7rem;"><strong>Número de Pedido:</strong> ${cid}</p>

                <div style="width:100%;padding:0.8rem;background-color:#39187a;text-transfrom:uppercase">
                    <h4 style="color: #ffff;">
                        <strong>Al momento de retirar tu pedido te pediremos el <i>Número de Pedido</i></strong>
                    </h4>
                </div>
            `
        }
    )
}

export const sendUserDeletionEmail = (to, name) => {
    return transporter.sendMail({
        from: `HosPet ${config.US_EMAIL}`,
        to: `${to}`,
        subject: "Cuenta Eliminada por Inactividad - HosPet",
        html: `
            <div style="width:100%;background-color: #7030f0;">
                <h1 style="color: #fff;padding:2.8rem;font-family: 'Mochiy Pop One'; font-weight: 600;text-align:center;">HosPet</h1>
            </div>

            <h2 style="padding-left:1.7rem;"><strong>Hola, ${name}</strong></h2>
            <p style="font-size:1rem;font-weight:400;">Lamentamos informarte que tu cuenta ha sido eliminada debido a la inactividad en los últimos días.</p>
            <p style="font-size:1rem;font-weight:400;">Si crees que esto es un error, por favor, contáctanos.</p>
            
            <div style="width:100%;padding:0.8rem;background-color:#39187a;text-align:center;">
                <h4 style="color: #fff;">Gracias por tu comprensión, <br><strong>El equipo de HosPet</strong></h4>
            </div>
        `
    })
}
