document.addEventListener('DOMContentLoaded', () => {
    const userCartId = document.getElementById('userCartId')
    document.querySelectorAll('.less-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id')
            console.log('es productId:', productId)
            const quantityInput = document.getElementById(`quantity-${productId}`)
            let currentQuantity = parseInt(quantityInput.value)
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1
            }
        })
    })

    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id')
            const quantityInput = document.getElementById(`quantity-${productId}`)
            let currentQuantity = parseInt(quantityInput.value)
            quantityInput.value = currentQuantity + 1
        })
    })

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id')
            const quantityInput = document.getElementById(`quantity-${productId}`)
            const quantity = parseInt(quantityInput.value) || 1
            try {
                const response = await fetch(`/api/carts/${userCartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, quantity, cartId: userCartId }) 
                })
                const data = await response.json()
                console.log('data de carts.js public:', data)
                if (data.message) {
                    alert(data.message)
                } else {
                    alert('Producto agregado al carrito')
                }
                /* if (response.ok) {
                const updatedCart = await response.json()
                console.log('Product added to cart:', updatedCart)
                    if (updatedCart.message) {
                        alert(updatedCart.message)
                    } else {
                        alert('Producto agregado al carrito')
                    }
                } else {
                    console.error('Failed to add product to cart')
                } */
            } catch (error) {
                console.error('Error:', error)
            }
        })
    })
})
