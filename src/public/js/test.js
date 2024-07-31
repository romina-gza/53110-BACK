const socket = io()

const form = document.getElementById('form')

form.addEventListener('submit', e => {
    e.preventDefault()
    let title = document.querySelector('input[name=title]').value
    let price = document.querySelector('input[name=price]').value
    let description = document.querySelector('input[name=description]').value
    let stock = document.querySelector('input[name=stock]').value
    let thumbnails = document.querySelector('input[name=thumbnails]').value

    let product = { title, description, price, stock, thumbnails: [thumbnails] }
    socket.emit('newProduct', product)
})

socket.on('nuevoProducto', nuevoProducto => {
    let cardProduct = document.getElementById('containerCards')
    let newCard = document.createElement('div')
    newCard.className = 'card m-3'
    newCard.style.minWidth = '18rem'
    newCard.style.maxWidth = '18rem'
    newCard.innerHTML = `
        <img src=${nuevoProducto.thumbnails[0]} class="card-img-top" style="height: 220px; width:100%; display:block; object-fit: cover" alt="imagen">
        <div class="card-body">
            <h5 class="card-title">${nuevoProducto.title}</h5>
            <p>Price: ${nuevoProducto.price}</p>
            <a href="#" class="btn btn-success">Agregar</a>
        </div>
    `
    cardProduct.appendChild(newCard);
})
