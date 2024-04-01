const socket = io()

const form = document.getElementById('form')

form.addEventListener('submit', e => {
    e.preventDefault()
    let title = document.querySelector('input[name=title]').value
    let price = document.querySelector('input[name=price]').value
    let description = document.querySelector('input[name=description]').value
    let stock = document.querySelector('input[name=stock]').value
    let thumbnails = document.querySelector('input[name=thumbnails]').value

    let product = { price, title, description, stock, thumbnails }
    console.log('products form hdbs: ', product)
    socket.emit('newProduct', product)
})
/* 
socket.on('nuevoProducto', nuevoProducto =>{
    console.log('nuevoProducto: ', nuevoProducto)
    let cardProduct = document.getElementById('containerCards')
    cardProduct+= `
        <div class="card m-3" style="min-width:18rem; max-width: 18rem;">
            <img src=${nuevoProducto.thumbnails[0]} class="card-img-top object-fit-cover border rounded" style="height: 100%;" alt="imagen" >
            <div class="card-body">
            <h5 class="card-title"> ${nuevoProducto.title}</h5>
            <p class="card-text"> ${nuevoProducto.description}</p>
            <p>Price: ${nuevoProducto.price}</p>
            <a href="#" class="btn btn-success">Buy!</a>
            </div>
        </div> 
    `
})
 */