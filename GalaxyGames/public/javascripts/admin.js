document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('role') !== 'Administrador') {
        window.location.href = '/index.html';
        return;
    }
    loadInventory();
});

async function loadInventory() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        renderInventoryTable(products);
    } catch (error) {
        console.error('Error cargando inventario:', error);
    }
}

function renderInventoryTable(products) {
    const tbody = document.getElementById('adminInventoryTable');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-white-50">No hay productos en la base de datos.</td></tr>';
        return;
    }

    products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td class="fw-bold text-info">${product.name}</td>
                <td>$${product.price}</td>
                <td>
                    <div class="input-group input-group-sm" style="max-width: 130px;">
                        <input type="number" class="form-control bg-dark text-white border-0" 
                               id="stock-${product._id}" value="${product.stock}">
                        <button class="btn btn-warning btn-sm" onclick="updateStock('${product._id}')">Actualizar</button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Dar de Baja</button>
                </td>
            </tr>
        `;
    });
}

// Alta de Producto Nuevo
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prodName').value;
    const description = document.getElementById('prodDesc').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const stock = parseInt(document.getElementById('prodStock').value);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price, stock })
        });

        if (response.ok) {
            alert('Producto añadido con éxito');
            document.getElementById('addProductForm').reset();
            loadInventory();
        } else {
            alert('Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Surtir/Modificar Inventario existente
async function updateStock(productId) {
    const newStock = document.getElementById(`stock-${productId}`).value;

    try {
        const response = await fetch(`/api/products/${productId}/stock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: parseInt(newStock) })
        });

        if (response.ok) {
            alert('Inventario actualizado de manera correcta');
            loadInventory();
        } else {
            alert('No se pudo actualizar el inventario');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Dar de Baja Producto
async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas retirar este producto de la tienda?')) return;

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Producto dado de baja exitosamente');
            loadInventory();
        } else {
            alert('Error al intentar eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
});