const userName = document.getElementById("userName").innerText
const message = document.getElementById("message")
const divMessages = document.getElementById("divMessages")

const socket = io()

socket.emit("presentation", userName)
socket.on("newMember", name => {
    Swal.fire({
        text:`${name} se ha conectado...!!!`,
        toast:true,
        position:"top-right"
    })
})

socket.on("history", messages => {
    messages.forEach(message => {
        divMessages.innerHTML += `<strong>${message.user}</strong> dice: <i>${message.message}</i> <br>`
    })
})

socket.on("newMessage", (user, message) => {
    divMessages.innerHTML += `<strong>${user}</strong> dice: <i>${message}</i> <br>`
})

message.addEventListener("keyup", e => {
    e.preventDefault()

    if (e.code === "Enter" && e.target.value.trim().length > 0) {
        socket.emit("message", userName, e.target.value.trim())
        e.target.value = ""
        e.target.focus()
    }
})
