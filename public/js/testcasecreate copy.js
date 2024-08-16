function testCaseCreate() {
    document.addEventListener("DOMContentLoaded", function() {
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
        

        function loadTestSuitesLevel2() {
            fetch('/api/test-suites-level-2')
                .then(response => response.json())
                .then(data => {
                    console.log('Received data:', data); // Verificar que los datos lleguen
                    const level2Select = document.getElementById('level2Select');
                    level2Select.innerHTML = '';  // Limpia el dropdown antes de llenarlo
        
                    // Agrega opción por defecto
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Select Test Suite Level 2';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    level2Select.appendChild(defaultOption);
        
                    // Llena el dropdown con los datos recibidos
                    data.forEach(level2 => {
                        const option = document.createElement('option');
                        option.value = level2.id;
                        option.textContent = level2.name;
                        console.log('Adding option:', option);
                        level2Select.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading Test Suite Level 2:', error));
        }
        
        
        // Load Actions
        function loadActions() {
            fetch('/api/actions')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error loading Actions');
                    }
                    return response.json();
                })
                .then(data => {
                    actionsSelect.innerHTML = '<option disabled selected>Select an Action</option>'; // Reset and add default option
                    data.forEach(action => {
                        const option = document.createElement('option');
                        option.value = action.id;
                        option.textContent = action.description;
                        actionsSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading Actions:', error));
        }

        // Load Expected Results
        function loadExpectedResults() {
            fetch('/api/expected-results')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error loading Expected Results');
                    }
                    return response.json();
                })
                .then(data => {
                    expectedResultsSelect.innerHTML = '<option disabled selected>Select Expected Results</option>'; // Reset and add default option
                    data.forEach(result => {
                        const option = document.createElement('option');
                        option.value = result.id;
                        option.textContent = result.description;
                        expectedResultsSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading Expected Results:', error));
        }

        // Add Action
        addActionBtn.addEventListener('click', function() {
            const selectedActionId = actionsSelect.value;
            const selectedActionText = actionsSelect.options[actionsSelect.selectedIndex].text;

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
                actionDiv.querySelector('.remove-action-btn').addEventListener('click', function() {
                    actionDiv.remove();
                    // Add the action back to the dropdown list
                    const option = document.createElement('option');
                    option.value = selectedActionId;
                    option.textContent = selectedActionText;
                    actionsSelect.appendChild(option);

                    // Re-sequence the remaining actions
                    [...actionsContainer.children].forEach((child, index) => {
                        child.querySelector('.input-group-text').textContent = index + 1;
                    });
                });
            }
        });

        // Load Test Cases into Table
        function loadTestCases() {
            fetch('/api/test-cases')
                .then(response => response.json())
                .then(data => {
                    testCasesTableBody.innerHTML = '';
                    data.forEach(testCase => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${testCase.id}</td>
                            <td>${testCase.name}</td>
                            <td>${testCase.importance}</td>
                            <td>${testCase.summary}</td>
                            <td>${testCase.preconditions}</td>
                            <td>${testCase.actions.map(action => action.description).join(', ')}</td>
                            <td>${testCase.expected_results.map(result => result.description).join(', ')}</td>
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

        // Attach event listeners for Edit and Delete buttons
        function attachEventListeners() {
            document.querySelectorAll('.edit-test-case').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    fetch(`/api/test-cases/${id}`)
                        .then(response => response.json())
                        .then(testCase => {
                            editTestCaseId.value = testCase.id;
                            document.getElementById('editTestCaseName').value = testCase.name;
                            document.getElementById('editImportance').value = testCase.importance;
                            document.getElementById('editSummary').value = testCase.summary;
                            document.getElementById('editPreconditions').value = testCase.preconditions;
                            document.getElementById('editLevel2Select').value = testCase.level_2_id;
                            document.getElementById('editExpectedResultsSelect').value = testCase.expected_results[0].id;

                            // Load actions into edit modal
                            const editActionsContainer = document.getElementById('editActionsContainer');
                            editActionsContainer.innerHTML = '';
                            testCase.actions.forEach((action, index) => {
                                const clonedSelect = actionsSelect.cloneNode(true);
                                clonedSelect.value = action.id;
                                editActionsContainer.appendChild(clonedSelect);
                            });

                            const modalInstance = new bootstrap.Modal(editTestCaseModal);
                            modalInstance.show();
                        })
                        .catch(error => console.error('Error loading test case for editing:', error));
                });
            });

            document.querySelectorAll('.delete-test-case').forEach(button => {
                button.addEventListener('click', function() {
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

        // Update Test Case
        updateTestCaseBtn.addEventListener('click', function() {
            const id = editTestCaseId.value;
            const name = document.getElementById('editTestCaseName').value.trim();
            const importance = document.getElementById('editImportance').value;
            const summary = document.getElementById('editSummary').value.trim();
            const preconditions = document.getElementById('editPreconditions').value.trim();
            const level_2_id = document.getElementById('editLevel2Select').value;
            
            const actions = Array.from(document.getElementById('editActionsContainer').querySelectorAll('select')).map((select, index) => ({
                id: select.value,
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
                    throw new Error('Error updating test case');
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

        // Load initial data
        loadTestSuitesLevel2();
        loadActions();
        loadExpectedResults();
        loadTestCases();
    });
}
