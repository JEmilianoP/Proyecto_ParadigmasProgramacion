document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    try {
        // Se envía explícitamente el rol 'Cliente' de forma interna
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role: 'Cliente' })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
            window.location.href = '/index.html';
        } else {
            alert(data.error || 'Error al registrar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});