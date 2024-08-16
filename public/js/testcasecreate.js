function testCaseCreate() {
    // Elements
    const level2Select = document.getElementById('level2Select');
    const actionsSelect = document.getElementById('actionsSelect');
    const actionsContainer = document.getElementById('actionsContainer');
    const addActionBtn = document.getElementById('addActionBtn');
    const expectedResultsSelect = document.getElementById('expectedResultsSelect');
    const createTestCaseBtn = document.getElementById('createTestCaseBtn');
    const testCasesTableBody = document.getElementById('testCasesTableBody');
    const editTestCaseModal = document.getElementById('editTestCaseModal');
    const editTestCaseId = document.getElementById('editTestCaseId');
    const updateTestCaseBtn = document.getElementById('updateTestCaseBtn');
    const editActionsContainer = document.getElementById('editActionsContainer');
    const editActionsSelect = document.getElementById('editActionsSelect');
    const addEditActionBtn = document.getElementById('addEditActionBtn');

    // Function to load Test Suites Level 2
    function loadTestSuitesLevel2(selectedValue = null) {
        fetch('/api/test-suites-level-2')
            .then(response => response.json())
            .then(data => {
                if (level2Select) {
                    level2Select.innerHTML = '';  // Clear the dropdown
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Select Test Suite Level 2';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    level2Select.appendChild(defaultOption);
                }

                const editLevel2Select = document.getElementById('editLevel2Select');
                if (editLevel2Select) {
                    editLevel2Select.innerHTML = ''; // Clear the dropdown in the edit modal
                    const defaultEditOption = document.createElement('option');
                    defaultEditOption.value = '';
                    defaultEditOption.textContent = 'Select Test Suite Level 2';
                    defaultEditOption.disabled = true;
                    defaultEditOption.selected = true;
                    editLevel2Select.appendChild(defaultEditOption);
                }

                // Populate the dropdown with data
                data.forEach(level2 => {
                    const option = document.createElement('option');
                    option.value = level2.id;
                    option.textContent = `${level2.name} - ${level2.level_1_name}`;

                    if (level2Select) {
                        level2Select.appendChild(option.cloneNode(true));
                    }
                    if (editLevel2Select) {
                        editLevel2Select.appendChild(option.cloneNode(true));
                    }
                });

                // Set the selected value if provided
                if (selectedValue && editLevel2Select) {
                    editLevel2Select.value = selectedValue;
                }
            })
            .catch(error => console.error('Error loading Test Suite Level 2:', error));
    }

    // Function to load Actions
    function loadActions() {
        fetch('/api/actions')
            .then(response => response.json())
            .then(data => {
                if (actionsSelect) {
                    actionsSelect.innerHTML = '<option disabled selected>Select an Action</option>'; // Reset and add default option
                }

                if (editActionsSelect) {
                    editActionsSelect.innerHTML = '<option disabled selected>Select an Action</option>'; // Reset and add default option for edit modal
                }

                data.forEach(action => {
                    const option = document.createElement('option');
                    option.value = action.id;
                    option.textContent = action.description;

                    if (actionsSelect) {
                        actionsSelect.appendChild(option.cloneNode(true));
                    }
                    if (editActionsSelect) {
                        editActionsSelect.appendChild(option.cloneNode(true));
                    }
                });
            })
            .catch(error => console.error('Error loading Actions:', error));
    }

    // Function to reload Actions Select in Edit Modal
    function reloadActionSelect() {
        fetch('/api/actions')
            .then(response => response.json())
            .then(data => {
                editActionsSelect.innerHTML = '<option disabled selected>Select an Action</option>'; // Reset and add default option

                data.forEach(action => {
                    const option = document.createElement('option');
                    option.value = action.id;
                    option.textContent = action.description;

                    // Evita volver a agregar acciones que ya están seleccionadas
                    const isSelected = [...editActionsContainer.querySelectorAll('input[name="actions[]"]')].some(input => input.value === action.id);
                    if (!isSelected) {
                        editActionsSelect.appendChild(option.cloneNode(true));
                    }
                });
            })
            .catch(error => console.error('Error loading Actions:', error));
    }

    // Function to load Expected Results
    function loadExpectedResults(selectedValue = null) {
        fetch('/api/expected-results')
            .then(response => response.json())
            .then(data => {
                if (expectedResultsSelect) {
                    expectedResultsSelect.innerHTML = '<option disabled selected>Select Expected Results</option>'; // Reset and add default option
                }

                const editExpectedResultsSelect = document.getElementById('editExpectedResultsSelect');
                if (editExpectedResultsSelect) {
                    editExpectedResultsSelect.innerHTML = ''; // Clear existing options in the edit modal
                    const defaultEditOption = document.createElement('option');
                    defaultEditOption.value = '';
                    defaultEditOption.textContent = 'Select Expected Results';
                    defaultEditOption.disabled = true;
                    defaultEditOption.selected = true;
                    editExpectedResultsSelect.appendChild(defaultEditOption);
                }

                data.forEach(result => {
                    const option = document.createElement('option');
                    option.value = result.id;
                    option.textContent = result.description;

                    if (expectedResultsSelect) {
                        expectedResultsSelect.appendChild(option.cloneNode(true));
                    }
                    if (editExpectedResultsSelect) {
                        editExpectedResultsSelect.appendChild(option.cloneNode(true));
                    }
                });

                // Set the selected value if provided
                if (selectedValue && editExpectedResultsSelect) {
                    editExpectedResultsSelect.value = selectedValue;
                }
            })
            .catch(error => console.error('Error loading Expected Results:', error));
    }

    // Function to add an action in the main form
    if (addActionBtn) {
        addActionBtn.addEventListener('click', function () {
            const selectedActionId = actionsSelect?.value;
            const selectedActionText = actionsSelect?.options[actionsSelect.selectedIndex]?.text || '';

            if (!selectedActionId) {
                alert('Por favor, selecciona una acción válida.');
                console.error("No se pudo obtener el valor de la acción seleccionada. Asegúrate de que el selector de acciones existe y tiene un valor seleccionado.");
                return;
            }

            if (selectedActionId) {
                const actionDiv = document.createElement('div');
                actionDiv.className = 'input-group mb-2';
                actionDiv.innerHTML = `
                    <span class="input-group-text">${actionsContainer.children.length + 1}</span>
                    <input type="text" class="form-control" value="${selectedActionText}" readonly>
                    <input type="hidden" name="actions[]" value="${selectedActionId}">
                    <button class="btn btn-danger remove-action-btn" type="button">Remove</button>
                `;
                actionsContainer.appendChild(actionDiv);

                // Remove selected action from dropdown
                actionsSelect.options[actionsSelect.selectedIndex].remove();

                // Re-attach event listener for new remove buttons
                actionDiv.querySelector('.remove-action-btn').addEventListener('click', function () {
                    actionDiv.remove();
                    // Add the action back to the dropdown list
                    const option = document.createElement('option');
                    option.value = selectedActionId;
                    option.textContent = selectedActionText;
                    actionsSelect.appendChild(option);

                    // Re-sequence the remaining actions
                    [...actionsContainer.children].forEach((child, index) => {
                        if (child.querySelector('.input-group-text')) {
                            child.querySelector('.input-group-text').textContent = index + 1;
                        }
                    });
                });
            } else {
                alert('Por favor, selecciona una acción válida.');
            }
        });
    }

    // Function to add an action in the edit modal
    if (addEditActionBtn) {
        addEditActionBtn.addEventListener('click', function () {
            const selectedActionId = editActionsSelect?.value;
            const selectedActionText = editActionsSelect?.options[editActionsSelect.selectedIndex]?.text || '';

            if (!selectedActionId) {
                alert('Por favor, selecciona una acción válida.');
                console.error("No se pudo obtener el valor de la acción seleccionada. Asegúrate de que el selector de acciones existe y tiene un valor seleccionado.");
                return; // Detén la ejecución si no hay una acción seleccionada
            }

            if (selectedActionId) {
                const actionDiv = document.createElement('div');
                actionDiv.className = 'input-group mb-2';
                actionDiv.innerHTML = `
                    <span class="input-group-text">${editActionsContainer.children.length + 1}</span>
                    <input type="text" class="form-control" value="${selectedActionText}" readonly>
                    <input type="hidden" name="actions[]" value="${selectedActionId}">
                    <button class="btn btn-danger remove-action-btn" type="button">Remove</button>
                `;
                editActionsContainer.appendChild(actionDiv);

                // Remove selected action from dropdown
                editActionsSelect.options[editActionsSelect.selectedIndex].remove();

                // Re-attach event listener for new remove buttons
                actionDiv.querySelector('.remove-action-btn').addEventListener('click', function () {
                    actionDiv.remove();
                    // Add the action back to the dropdown list
                    const option = document.createElement('option');
                    option.value = selectedActionId;
                    option.textContent = selectedActionText;
                    editActionsSelect.appendChild(option);

                    // Re-sequence the remaining actions
                    [...editActionsContainer.children].forEach((child, index) => {
                        if (child.querySelector('.input-group-text')) {
                            child.querySelector('.input-group-text').textContent = index + 1;
                        }
                    });
                });
            } else {
                alert('Por favor, selecciona una acción válida.');
            }
        });
    }

    // Function to load Test Cases into Table
    function loadTestCases() {
        fetch('/api/test-cases')
            .then(response => response.json())
            .then(data => {
                testCasesTableBody.innerHTML = '';
                data.forEach(testCase => {
                    // Verifica que el objeto testCase esté bien formado y que tenga acciones y resultados esperados
                    const actions = Array.isArray(testCase.actions) ? testCase.actions : [];
                    const expectedResults = Array.isArray(testCase.expected_results) ? testCase.expected_results : [];

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${testCase.id || 'N/A'}</td>
                        <td>${testCase.name || 'N/A'}</td>
                        <td>${testCase.importance || 'N/A'}</td>
                        <td>${testCase.summary || 'N/A'}</td>
                        <td>${testCase.preconditions || 'N/A'}</td>
                        <td>${actions.map(action => action?.description || 'N/A').join(', ')}</td>
                        <td>${expectedResults.map(result => result?.description || 'N/A').join(', ')}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-test-case" data-id="${testCase.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-test-case" data-id="${testCase.id}">Delete</button>
                        </td>
                    `;
                    testCasesTableBody.appendChild(row);
                });
                attachEventListeners();
            })
            .catch(error => console.error('Error loading Test Cases:', error));
    }

    function attachEventListeners() {
        document.querySelectorAll('.edit-test-case').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                fetch(`/api/test-cases/${id}`)
                    .then(response => response.json())
                    .then(testCase => {
                        editTestCaseId.value = testCase.id || '';
                        document.getElementById('editTestCaseName').value = testCase.name || '';
                        document.getElementById('editImportance').value = testCase.importance || '';
                        document.getElementById('editSummary').value = testCase.summary || '';
                        document.getElementById('editPreconditions').value = testCase.preconditions || '';
    
                        // Cargar el valor del Test Suite Level 2 seleccionado
                        loadTestSuitesLevel2(testCase.level_2_id);
    
                        // Cargar el valor del Expected Result seleccionado
                        loadExpectedResults(testCase.expected_results?.[0]?.id);
    
                        // Load actions into edit modal
                        editActionsContainer.innerHTML = '';
                        const actions = Array.isArray(testCase.actions) ? testCase.actions : [];
                        actions.forEach((action, index) => {
                            const actionDescription = action?.description || 'N/A'; // Manejo de posibles valores null
                            const actionId = action?.id || '';
    
                            const actionDiv = document.createElement('div');
                            actionDiv.className = 'input-group mb-2';
                            actionDiv.innerHTML = `
                                <span class="input-group-text">${index + 1}</span>
                                <input type="text" class="form-control" value="${actionDescription}" readonly>
                                <input type="hidden" name="actions[]" value="${actionId}">
                                <button class="btn btn-danger remove-action-btn" type="button">Remove</button>
                            `;
                            editActionsContainer.appendChild(actionDiv);
    
                            // Re-attach event listener for remove buttons
                            actionDiv.querySelector('.remove-action-btn').addEventListener('click', function () {
                                actionDiv.remove();
                                // Add the action back to the dropdown list
                                const option = document.createElement('option');
                                option.value = actionId;
                                option.textContent = actionDescription;
                                editActionsSelect.appendChild(option);
    
                                // Re-sequence the remaining actions
                                [...editActionsContainer.children].forEach((child, idx) => {
                                    if (child.querySelector('.input-group-text')) {
                                        child.querySelector('.input-group-text').textContent = idx + 1;
                                    }
                                });
                            });
                        });
    
                        // Recargar el selector de acciones
                        reloadActionSelect();
    
                        const modalInstance = new bootstrap.Modal(editTestCaseModal);
                        modalInstance.show();
                    })
                    .catch(error => console.error('Error loading test case for editing:', error));
            });
        });
    
        document.querySelectorAll('.delete-test-case').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this test case?')) {
                    fetch(`/api/test-cases/${id}`, {
                        method: 'DELETE'
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error deleting test case');
                            }
                            loadTestCases(); // Reload the table
                            alert('Test case deleted successfully.');
                        })
                        .catch(error => console.error('Error deleting test case:', error));
                }
            });
        });
    }
    
    // Llamamos a reloadActionSelect para poblar el selector con las acciones restantes
    function reloadActionSelect() {
        fetch('/api/actions')
            .then(response => response.json())
            .then(data => {
                editActionsSelect.innerHTML = '<option disabled selected>Select an Action</option>'; // Reset and add default option
    
                data.forEach(action => {
                    const option = document.createElement('option');
                    option.value = action.id;
                    option.textContent = action.description;
    
                    // Evita volver a agregar acciones que ya están seleccionadas
                    const isSelected = [...editActionsContainer.querySelectorAll('input[name="actions[]"]')].some(input => input.value === action.id);
                    if (!isSelected) {
                        editActionsSelect.appendChild(option.cloneNode(true));
                    }
                });
            })
            .catch(error => console.error('Error loading Actions:', error));
    }
    

    // Update Test Case
    if (updateTestCaseBtn) {
        updateTestCaseBtn.addEventListener('click', function () {
            const id = editTestCaseId.value;
            const name = document.getElementById('editTestCaseName').value.trim();
            const importance = document.getElementById('editImportance').value;
            const summary = document.getElementById('editSummary').value.trim();
            const preconditions = document.getElementById('editPreconditions').value.trim();
            const level_2_id = document.getElementById('editLevel2Select').value;
    
            const actions = Array.from(editActionsContainer.querySelectorAll('input[name="actions[]"]')).map((input, index) => ({
                id: input.value,
                sequence: index + 1
            }));
    
            const expected_results = [{ id: document.getElementById('editExpectedResultsSelect').value }];
    
            const updatedTestCaseData = {
                name,
                importance,
                summary,
                preconditions,
                level_2_id,
                actions,
                expected_results
            };
    
            fetch(`/api/test-cases/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTestCaseData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => { throw new Error(errorData.error || 'Error updating test case'); });
                }
                return response.json();
            })
            .then(data => {
                const modalInstance = bootstrap.Modal.getInstance(editTestCaseModal);
                modalInstance.hide();
                loadTestCases(); // Reload the table
                alert('Test case updated successfully.');
            })
            .catch(error => console.error('Error updating test case:', error));
        });
    }
    // Function to create a new Test Case
    if (createTestCaseBtn) {
        createTestCaseBtn.addEventListener('click', function () {
            const name = document.getElementById('testCaseName').value.trim();
            const importance = document.getElementById('importance').value;
            const summary = document.getElementById('summary').value.trim();
            const preconditions = document.getElementById('preconditions').value.trim();
            const level_2_id = level2Select.value;

            const actions = Array.from(actionsContainer.querySelectorAll('input[name="actions[]"]')).map((input, index) => ({
                id: input.value,
                sequence: index + 1
            }));

            const expected_results = [{ id: expectedResultsSelect.value }];

            const newTestCaseData = {
                name,
                importance,
                summary,
                preconditions,
                level_2_id,
                actions,
                expected_results
            };

            fetch('/api/test-cases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTestCaseData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error creating test case');
                    }
                    return response.json();
                })
                .then(data => {
                    loadTestCases(); // Reload the table
                    resetForm();
                    alert('Test case created successfully.');
                })
                .catch(error => console.error('Error creating test case:', error));
        });
    }

    // Function to reset the form
    function resetForm() {
        if (document.getElementById('testCaseName')) document.getElementById('testCaseName').value = '';
        if (document.getElementById('importance')) document.getElementById('importance').value = '';
        if (document.getElementById('summary')) document.getElementById('summary').value = '';
        if (document.getElementById('preconditions')) document.getElementById('preconditions').value = '';
        if (level2Select) level2Select.value = '';
        if (expectedResultsSelect) expectedResultsSelect.value = '';
        if (actionsContainer) actionsContainer.innerHTML = '';
        loadActions();
        loadExpectedResults();
        loadTestSuitesLevel2();
    }

    // Load initial data
    loadTestSuitesLevel2();
    loadActions();
    loadExpectedResults();
    loadTestCases();
}
