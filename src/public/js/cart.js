
document.addEventListener('DOMContentLoaded', () => {
    const userCartId = document.getElementById('userCartId')
    document.querySelectorAll('.less-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id')
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
                if (data.message) {
                    alert(data.message)
                } else {
                    alert('Producto agregado al carrito')
                }
            } catch (err) {
                return err
            }
        })
    })

    // processPurchase 
    const processPurchaseButton = document.getElementById('process-purchase');
    processPurchaseButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/carts/${userCartId}/purchase`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                alert('Compra realizada con éxito');
            } else {
                alert('Error al realizar la compra: ' + data.message);
            }
        } catch (err) {
            alert('Error al realizar la compra');
            return err
        }
    });
})
