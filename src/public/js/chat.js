const userName = document.getElementById("userName")
const message = document.getElementById("message")
const divMessages = document.getElementById("divMessages")

Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su nombre de usuario",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un nombre de usuario...!!!"
    },
    allowOutsideClick:false
})

.then( data => {
    let user = data.value
    console.log(user)

    userName.innerHTML += user
    message.focus()

    const socket = io()
    socket.emit("presentation", user)
    socket.on("newMember", name => {
        Swal.fire({
            text:`${name} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
    } )

    socket.on("history", messages =>{
        messages.forEach( message => {
            divMessages.innerHTML += `<strong>${message.user}</strong> dice: <i>${message.message}</i> <br>`
        });
    })

    socket.on("newMessage", (user, message)=> {
        divMessages.innerHTML += `<strong>${user}</strong> dice: <i>${message}</i> <br>`
    })

    message.addEventListener("keyup", e => {
        e.preventDefault()
        // console.log("e", e)
        // console.log(e.target.value)

        if (e.code === "Enter" && e.target.value.trim().length>0 ) {
            socket.emit("message", user, e.target.value.trim())
            e.target.value = ""
            e.target.focus()
        }

    })
})
