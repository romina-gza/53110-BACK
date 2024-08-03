document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-edit-role').forEach(button => {
        button.addEventListener('click', async () => {
            const cid = button.getAttribute('data-id');
            const newRole = prompt('Ingrese el nuevo rol (user/admin/premium):');

            if (['user', 'admin', 'premium'].includes(newRole)) {
                try {
                    const response = await fetch(`/api/users/${cid}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ newRole })
                    });
                    if (response.ok) {
                        alert('Rol modificado exitosamente');
                        location.reload();
                    } else {
                        console.log('respose ess:', response)
                        alert('Error al modificar el rol');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                alert(`Rol inválido: << ${newRole} >>. Solo se permiten los roles: user, admin, premium.`);
            }
        });
    });

    document.querySelectorAll('.btn-delete-user').forEach(button => {
        button.addEventListener('click', async () => {
            const cid = button.getAttribute('data-id');
            if (confirm('¿Estás seguro de eliminar este usuario?')) {
                try {
                    const response = await fetch(`/api/users/${cid}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        alert('Usuario eliminado exitosamente');
                        location.reload();
                    } else {
                        console.log('respose ess:', response)
                        alert('Error al eliminar el usuario');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    });
});
