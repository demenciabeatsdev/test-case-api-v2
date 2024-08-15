function initializeExpectedResults() {
    const expectedResultNameInput = document.getElementById('expectedResultsName');
    const createExpectedResultBtn = document.getElementById('createExpectedResultsBtn');
    const expectedResultTableBody = document.getElementById('expectedResultsTableBody');
    const editExpectedResultModal = document.getElementById('editExpectedResultModal');
    const editExpectedResultId = document.getElementById('editExpectedResultId');
    const updateExpectedResultBtn = document.getElementById('updateExpectedResultBtn');

    // Verifica que los elementos existen antes de continuar
    console.log("expectedResultNameInput:", expectedResultNameInput);
    console.log("createExpectedResultBtn:", createExpectedResultBtn);
    console.log("expectedResultTableBody:", expectedResultTableBody);
    console.log("editExpectedResultModal:", editExpectedResultModal);
    console.log("editExpectedResultId:", editExpectedResultId);
    console.log("updateExpectedResultBtn:", updateExpectedResultBtn);

    if (!expectedResultNameInput || !createExpectedResultBtn || !expectedResultTableBody || !editExpectedResultModal || !editExpectedResultId || !updateExpectedResultBtn) {
        console.error('Uno o más elementos necesarios no fueron encontrados en el DOM.');
        return;
    }

    const modalInstance = new bootstrap.Modal(editExpectedResultModal);

    function loadExpectedResults() {
        fetch('/api/expected-results')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error loading expected results');
                }
                return response.json();
            })
            .then(data => {
                expectedResultTableBody.innerHTML = '';
                data.forEach(result => {
                    expectedResultTableBody.innerHTML += `
                        <tr>
                            <td>${result.id}</td>
                            <td>${result.description}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-expected-result" data-id="${result.id}" data-description="${result.description}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-expected-result" data-id="${result.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                attachEventListeners();
            })
            .catch(error => console.error('Error loading expected results:', error));
    }

    createExpectedResultBtn.addEventListener('click', function() {
        const description = expectedResultNameInput.value.trim();
        if (!description) {
            alert('Expected result name cannot be empty.');
            return;
        }

        fetch('/api/expected-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error creating expected result');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                loadExpectedResults();
                expectedResultNameInput.value = '';
                alert(data.message || 'Expected result created successfully.');
            }
        })
        .catch(error => console.error('Error creating expected result:', error));
    });

    function attachEventListeners() {
        document.querySelectorAll('.edit-expected-result').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const description = this.getAttribute('data-description');
                editExpectedResultId.value = id;
                document.getElementById('editExpectedResultName').value = description;

                modalInstance.show();
            });
        });

        document.querySelectorAll('.delete-expected-result').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this expected result?')) {
                    fetch(`/api/expected-results/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error deleting expected result');
                        }
                        return response.text().then(text => text ? JSON.parse(text) : {});
                    })
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            loadExpectedResults();
                            alert(data.message || 'Expected result deleted successfully.');
                        }
                    })
                    .catch(error => console.error('Error deleting expected result:', error));
                }
            });
        });
        
        updateExpectedResultBtn.addEventListener('click', function() {
            const id = editExpectedResultId.value;
            const description = document.getElementById('editExpectedResultName').value.trim();
            if (!description) {
                alert('Expected result name cannot be empty.');
                return;
            }
        
            fetch(`/api/expected-results/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating expected result');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    loadExpectedResults();
                    modalInstance.hide();
                    alert(data.message || 'Expected result updated successfully.');
                }
            })
            .catch(error => console.error('Error updating expected result:', error));
        });
    }

    loadExpectedResults();
}
