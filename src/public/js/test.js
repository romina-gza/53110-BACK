const socket = io()

document.getElementById('form').onsubmit = e => {
    e.preventDefault();
    socket.emit('nuevoProducto', {});
};
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