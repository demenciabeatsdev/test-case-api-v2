function initializeAction() {
    const actionNameInput = document.getElementById('actionName');
    const createActionBtn = document.getElementById('createActionBtn');
    const actionTableBody = document.getElementById('actionTableBody');
    const editActionModal = document.getElementById('editActionModal');
    const editActionId = document.getElementById('editActionId');
    const updateActionBtn = document.getElementById('updateActionBtn');

    // Verifica que los elementos existen antes de continuar
    console.log("actionNameInput:", actionNameInput);
    console.log("createActionBtn:", createActionBtn);
    console.log("actionTableBody:", actionTableBody);
    console.log("editActionModal:", editActionModal);
    console.log("editActionId:", editActionId);
    console.log("updateActionBtn:", updateActionBtn);

    if (!actionNameInput || !createActionBtn || !actionTableBody || !editActionModal || !editActionId || !updateActionBtn) {
        console.error('Uno o más elementos necesarios no fueron encontrados en el DOM.');
        return;
    }

    const modalInstance = new bootstrap.Modal(editActionModal);

    // Cargar acciones
    function loadActions() {
        fetch('/api/actions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error loading actions');
                }
                return response.json();
            })
            .then(data => {
                actionTableBody.innerHTML = '';
                data.forEach(action => {
                    actionTableBody.innerHTML += `
                        <tr>
                            <td>${action.id}</td>
                            <td>${action.description}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-action" data-id="${action.id}" data-description="${action.description}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-action" data-id="${action.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                attachEventListeners();
            })
            .catch(error => console.error('Error loading actions:', error));
    }

    // Crear una nueva acción
    createActionBtn.addEventListener('click', function() {
        const description = actionNameInput.value.trim();
        if (!description) {
            alert('Action name cannot be empty.');
            return;
        }

        fetch('/api/actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error creating action');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                loadActions();
                actionNameInput.value = '';
                alert(data.message || 'Action created successfully.');
            }
        })
        .catch(error => console.error('Error creating action:', error));
    });

    // Función para agregar listeners a los botones de editar y eliminar
    function attachEventListeners() {
        document.querySelectorAll('.edit-action').forEach(button => {
            button.removeEventListener('click', editAction); // Remover listener previo
            button.addEventListener('click', editAction); // Agregar listener actualizado
        });

        document.querySelectorAll('.delete-action').forEach(button => {
            button.removeEventListener('click', deleteAction); // Remover listener previo
            button.addEventListener('click', deleteAction); // Agregar listener actualizado
        });
    }

    // Función para editar una acción
    function editAction() {
        const id = this.getAttribute('data-id');
        const description = this.getAttribute('data-description');
        editActionId.value = id;
        document.getElementById('editActionName').value = description;

        modalInstance.show();
    }

    // Función para eliminar una acción
    function deleteAction() {
        const id = this.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this action?')) {
            fetch(`/api/actions/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error deleting action');
                }
                // Verifica si hay contenido antes de intentar convertirlo a JSON
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    loadActions();  // Recargar la lista de acciones
                    alert(data.message || 'Action deleted successfully.');
                }
            })
            .catch(error => console.error('Error deleting action:', error));
        }
    }

    // Actualizar una acción
    updateActionBtn.addEventListener('click', function() {
        const id = editActionId.value;
        const description = document.getElementById('editActionName').value.trim();
        if (!description) {
            alert('Action name cannot be empty.');
            return;
        }

        fetch(`/api/actions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating action');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                loadActions();  // Recargar la lista de acciones
                modalInstance.hide();  // Ocultar el modal
                alert(data.message || 'Action updated successfully.');
            }
        })
        .catch(error => console.error('Error updating action:', error));
    });

    // Inicializar la carga de acciones
    loadActions();
}
