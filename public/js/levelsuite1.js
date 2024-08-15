function initializeLevelSuite1() {
    const suiteNameInput = document.getElementById('suiteName');
    const createSuiteBtn = document.getElementById('createSuiteBtn');
    const suiteTableBody = document.getElementById('suiteTableBody');
    const editSuiteModal = document.getElementById('editSuiteModal');
    const editSuiteId = document.getElementById('editSuiteId');
    const editSuiteName = document.getElementById('editSuiteName');
    const updateSuiteBtn = document.getElementById('updateSuiteBtn');

    if (editSuiteModal) {
        const modalInstance = new bootstrap.Modal(editSuiteModal);

        // Load existing suites
        function loadSuites() {
            fetch('/api/test-suites')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error loading suites');
                    }
                    return response.json();
                })
                .then(data => {
                    suiteTableBody.innerHTML = '';
                    data.forEach(suite => {
                        suiteTableBody.innerHTML += `
                            <tr>
                                <td>${suite.id}</td>
                                <td>${suite.name}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm edit-suite" data-id="${suite.id}" data-name="${suite.name}">Edit</button>
                                    <button class="btn btn-danger btn-sm delete-suite" data-id="${suite.id}">Delete</button>
                                </td>
                            </tr>
                        `;
                    });
                    attachEventListeners();
                })
                .catch(error => console.error('Error loading suites:', error));
        }

        // Create a new suite
        createSuiteBtn.addEventListener('click', function() {
            const name = suiteNameInput.value.trim();
            if (!name) {
                alert('Suite name cannot be empty.');
                return;
            }

            fetch('/api/test-suites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error creating suite');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    loadSuites();
                    suiteNameInput.value = '';
                    alert(data.message || 'Test suite created successfully.');
                }
            })
            .catch(error => console.error('Error creating suite:', error));
        });

        // Attach event listeners to buttons
        function attachEventListeners() {
            document.querySelectorAll('.edit-suite').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    editSuiteId.value = id;
                    editSuiteName.value = name;

                    modalInstance.show();
                });
            });

            document.querySelectorAll('.delete-suite').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this suite?')) {
                        fetch(`/api/test-suites/${id}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error deleting suite');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.error) {
                                alert(data.error);
                            } else {
                                loadSuites();
                                alert(data.message || 'Test suite deleted successfully.');
                            }
                        })
                        .catch(error => console.error('Error deleting suite:', error));
                    }
                });
            });
        }

        // Update suite
        updateSuiteBtn.addEventListener('click', function() {
            const id = editSuiteId.value;
            const name = editSuiteName.value.trim();
            if (!name) {
                alert('Suite name cannot be empty.');
                return;
            }

            fetch(`/api/test-suites/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating suite');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    loadSuites();
                    modalInstance.hide();
                    alert(data.message || 'Test suite updated successfully.');
                }
            })
            .catch(error => console.error('Error updating suite:', error));
        });

        // Initial load
        loadSuites();
    } else {
        console.error("No se pudo encontrar el modal.");
    }
}
