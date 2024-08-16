
function initializeTestCaseFilter() {
    const filterLevel1Select = document.getElementById('filterLevel1Select');
    const filterLevel2Select = document.getElementById('filterLevel2Select');
    const filterBtn = document.getElementById('filterBtn');
    const exportBtn = document.getElementById('exportBtn');  // Añade esta línea
    const testCasesTableBody = document.getElementById('testCasesTableBody');

    // Cargar las opciones de Level 1
    function loadLevel1Suites() {
        fetch('/api/test-suites')
            .then(response => response.json())
            .then(data => {
                filterLevel1Select.innerHTML = '<option value="" disabled selected>Select Level 1 Test Suite</option>';
                data.forEach(suite => {
                    const option = document.createElement('option');
                    option.value = suite.id;
                    option.textContent = suite.name;
                    filterLevel1Select.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading Level 1 Test Suites:', error));
    }

    // Cargar las opciones de Level 2 cuando se selecciona una opción de Level 1
    filterLevel1Select.addEventListener('change', function() {
        const level1Id = filterLevel1Select.value;

        fetch(`/api/test-suites-level-2/level1/${level1Id}`)
            .then(response => response.json())
            .then(data => {
                filterLevel2Select.innerHTML = '<option value="" disabled selected>Select Level 2 Test Suite</option>';
                data.forEach(suite => {
                    const option = document.createElement('option');
                    option.value = suite.id;
                    option.textContent = suite.name;
                    filterLevel2Select.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading Level 2 Test Suites:', error));
    });

    // Buscar y mostrar los casos de prueba cuando se hace clic en el botón de filtro
    filterBtn.addEventListener('click', function() {
        const level2Id = filterLevel2Select.value;

        if (!level2Id) {
            alert('Please select a Level 2 Test Suite.');
            return;
        }

        fetch(`/api/test-cases?level2=${level2Id}`)
            .then(response => response.json())
            .then(data => {
                testCasesTableBody.innerHTML = '';

                data.forEach(testCase => {
                    const actions = Array.isArray(testCase.actions) ? testCase.actions : [];
                    const expectedResults = Array.isArray(testCase.expected_results) ? testCase.expected_results : [];

                    // Crear una fila por cada acción
                    actions.forEach((action, index) => {
                        const row = document.createElement('tr');
                        if (index === 0) {
                            row.innerHTML = `
                                <td>${testCase.level_1_name || 'undefined'}</td>
                                <td>${testCase.level_2_name || 'undefined'}</td>
                                <td>${testCase.name || 'undefined'}</td>
                                <td>${testCase.importance || 'undefined'}</td>
                                <td>${testCase.summary || 'undefined'}</td>
                                <td>${testCase.preconditions || 'undefined'}</td>
                                <td>${action.description || 'undefined'}</td>
                                <td>${expectedResults[0]?.description || 'undefined'}</td>
                            `;
                        } else {
                            row.innerHTML = `
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>${action.description || 'undefined'}</td>
                                <td></td>
                            `;
                        }
                        testCasesTableBody.appendChild(row);
                    });
                });
            })
            .catch(error => console.error('Error loading test cases:', error));
    });

    // Descargar el archivo Excel cuando se hace clic en el botón de exportación

exportBtn.addEventListener('click', function() {
    const level2Id = filterLevel2Select.value;

    if (!level2Id) {
        alert('Please select a Level 2 Test Suite.');
        return;
    }

    fetch(`/api/test-cases/export/excel?level2=${level2Id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test-cases.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error exporting test cases to Excel:', error));
});


    // Cargar los Level 1 Test Suites al inicializar
    loadLevel1Suites();
}
