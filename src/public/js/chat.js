const userName = document.getElementById("userName")
const message = document.getElementById("message")
const divMessages = document.getElementById("divMessages")

Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su name",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un name...!!!"
    },
    allowOutsideClick:false
})

.then( data => {
    let name = data.value
    console.log(name)

    userName.innerHTML += name
    message.focus()

    const socket = io()
    socket.emit("presentation", name)
    socket.on("newMember", name => {
        Swal.fire({
            text:`${name} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
    } )

    socket.on("newMessage", (name, message)=> {
        divMessages.innerHTML += `<strong>${name}</strong> dice: <i>${message}</i> <br>`
    })

    message.addEventListener("keyup", e => {
        e.preventDefault()
        // console.log("e", e)
        // console.log(e.target.value)

        if (e.code === "Enter" && e.target.value.trim().length>0 ) {
            socket.emit("message", name, e.target.value.trim())
            e.target.value = ""
            e.target.focus()
        }

    })
})
/* 
divMensajes.scrollTop=divMensajes.scrollHeight;
 */