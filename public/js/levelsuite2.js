function initializeLevelSuite2() {
    const level1Select = document.getElementById('level1Select');  
    const suiteNameInput = document.getElementById('suiteName');  
    const createSuiteBtn = document.getElementById('createSuiteBtn');
    const suiteTableBody = document.getElementById('suiteTableBody');
    const editSuiteModal = document.getElementById('editSuiteModal');
    const editSuiteId = document.getElementById('editSuiteId');
    const editSuiteName = document.getElementById('editSuiteName');
    const editLevel1Select = document.getElementById('editLevel1Select'); // Nuevo dropdown en el modal para el Level 1
    const updateSuiteBtn = document.getElementById('updateSuiteBtn');

    if (editSuiteModal) {
        const modalInstance = new bootstrap.Modal(editSuiteModal);

        // Load existing Test Suite Level 1 options into the dropdowns
        function loadTestSuitesLevel1() {
            fetch('/api/test-suites')
                .then(response => response.json())
                .then(data => {
                    // Clear the dropdowns
                    level1Select.innerHTML = '';
                    editLevel1Select.innerHTML = '';

                    // Default option for both dropdowns
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Select Level 1 Test Suite';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    level1Select.appendChild(defaultOption);
                    editLevel1Select.appendChild(defaultOption.cloneNode(true));

                    // Populate the dropdowns with the data
                    data.forEach(suite => {
                        const option = document.createElement('option');
                        option.value = suite.id;
                        option.textContent = suite.name;
                        level1Select.appendChild(option);
                        editLevel1Select.appendChild(option.cloneNode(true));
                    });
                })
                .catch(error => console.error('Error loading Test Suite Level 1:', error));
        }

        // Load existing Test Suite Level 2
        function loadSuites() {
            fetch('/api/test-suites-level-2')
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
                                <td>${suite.level_1_name}</td>
                                <td>${suite.name}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm edit-suite" data-id="${suite.id}" data-name="${suite.name}" data-level1-id="${suite.level_1_id}">Edit</button>
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
            const level1Id = level1Select.value;
            if (!name) {
                alert('Suite name cannot be empty.');
                return;
            }

            if (!level1Id) {
                alert('Please select a Level 1 Test Suite.');
                return;
            }

            fetch('/api/test-suites-level-2/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, level_1_id: level1Id })
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
                    suiteNameInput.value = ''; // Clear the input field
                    level1Select.value = ''; // Reset the dropdown to the default value
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
                    const level1Id = this.getAttribute('data-level1-id');
                    editSuiteId.value = id;
                    editSuiteName.value = name;
                    editLevel1Select.value = level1Id;

                    modalInstance.show();
                });
            });

            document.querySelectorAll('.delete-suite').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this suite?')) {
                        fetch(`/api/test-suites-level-2/${id}`, {
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
            const level1Id = editLevel1Select.value;

            if (!name) {
                alert('Suite name cannot be empty.');
                return;
            }

            if (!level1Id) {
                alert('Please select a Level 1 Test Suite.');
                return;
            }

            fetch(`/api/test-suites-level-2/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, level_1_id: level1Id })
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
        loadTestSuitesLevel1(); // Load Test Suite Level 1 options
        loadSuites();
    } else {
        console.error("No se pudo encontrar el modal.");
    }
}
