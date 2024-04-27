document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card')
    cards.forEach(function(card) {
        const title = card.querySelector('.card-title')
        title.addEventListener('click', function(event) {
            event.preventDefault()
            const cardId = card.getAttribute('id')
            const url = `http://localhost:8080/products/product/${cardId}`
            window.location.href = url
        })
    })
})
