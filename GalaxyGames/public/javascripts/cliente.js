let productsList = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('role') !== 'Cliente') {
        window.location.href = '/index.html';
        return;
    }
    document.getElementById('welcomeUser').textContent = `Hola, ${localStorage.getItem('username')}`;
    loadProducts();
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        productsList = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function renderProducts() {
    const catalog = document.getElementById('productsCatalog');
    catalog.innerHTML = '';

    if (productsList.length === 0) {
        catalog.innerHTML = '<p class="text-white-50">No hay productos disponibles con stock en este momento.</p>';
        return;
    }

    productsList.forEach(product => {
        catalog.innerHTML += `
            <div class="col">
                <div class="card bg-secondary text-white h-100 border-0 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-info">${product.name}</h5>
                        <p class="card-text text-white-50 flex-grow-1">${product.description || 'Sin descripción'}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fs-4 fw-bold text-warning">$${product.price}</span>
                            <span class="badge bg-dark">Stock: ${product.stock}</span>
                        </div>
                        <button class="btn btn-primary btn-sm mt-3 w-100" onclick="addToCart('${product._id}')">
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function addToCart(productId) {
    const product = productsList.find(p => p._id === productId);
    const cartItem = cart.find(item => item._id === productId);

    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert('No hay más stock disponible de este producto.');
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item._id === productId);
    const product = productsList.find(p => p._id === productId);

    if (!cartItem) return;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item._id !== productId);
    } else if (cartItem.quantity > product.stock) {
        alert('Has alcanzado el límite de existencias en inventario.');
        cartItem.quantity = product.stock;
    }

    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-white-50 text-center">El carrito está vacío.</p>';
        totalElement.textContent = '$0.00';
        checkoutBtn.disabled = true;
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        container.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2 bg-dark p-2 rounded">
                <div>
                    <h6 class="mb-0 text-truncate" style="max-width: 150px;">${item.name}</h6>
                    <small class="text-warning">$${item.price} c/u</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="updateQuantity('${item._id}', -1)">-</button>
                    <span class="mx-2 fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-success py-0 px-2" onclick="updateQuantity('${item._id}', 1)">+</button>
                </div>
            </div>
        `;
    });

    totalElement.textContent = `$${total.toFixed(2)}`;
    checkoutBtn.disabled = false;
}

document.getElementById('checkoutBtn').addEventListener('click', async () => {
    // Evitar procesar un carrito vacío
    if (cart.length === 0) return;

    try {
        // Enviar el carrito al backend
        const response = await fetch('/api/products/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cart }) // Mandar el arreglo de productos
        });

        if (response.ok) {
            alert('¡Compra realizada con éxito! Gracias por elegir Galaxy Games.');
            
            // Vaciar el carrito en el frontend
            cart = []; 
            renderCart(); 
            
            // Recargar los productos desde el servidor para ver el stock actualizado
            loadProducts(); 
        } else {
            const data = await response.json();
            alert(data.error || 'Hubo un problema al procesar tu compra.');
        }
    } catch (error) {
        console.error('Error al realizar el pago:', error);
        alert('Error de conexión al intentar procesar el pago.');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
});