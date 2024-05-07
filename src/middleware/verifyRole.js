/* NINGUNO FUNCIONO */
// Verifica roles, en este caso si es el user es admin.
export const isAdmin = ( req, res, next) => {
    const emailCoder = "adminCoder@coder.com"
    //    if (req.user && req.user.role === 'admin') next()

    let { email } = req.body
    if (email === emailCoder){
        req.body.role = 'admin'
    }  
    
    console.log('req.usermiddl: ' , email, "role ", req.body.role)
    next()
}
// testeo 2
export const verifyRole = (req, res, next) => {
    let { email, password } = req.body
    const eCoder = "adminCoder@coder.com"
    const psw = "adminCod3r123"
    if (email === eCoder && password === psw) {
        req.body.role = 'admin'
    }
    next()
}