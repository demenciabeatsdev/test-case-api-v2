const pool = require('../config/database');

// Obtener todos los casos de prueba con sus acciones y resultados esperados
const getTestCases = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                tc.*, 
                json_agg(DISTINCT ta.*) as actions,
                json_agg(DISTINCT er.*) as expected_results
            FROM test_case tc
            LEFT JOIN test_case_actions tca ON tca.test_case_id = tc.id
            LEFT JOIN test_actions ta ON ta.id = tca.action_id
            LEFT JOIN test_case_expected_results tcer ON tcer.test_case_id = tc.id
            LEFT JOIN expected_results er ON er.id = tcer.expected_result_id
            GROUP BY tc.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un caso de prueba por ID con sus acciones y resultados esperados
const getTestCaseById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                tc.*, 
                json_agg(DISTINCT ta.*) as actions,
                json_agg(DISTINCT er.*) as expected_results
            FROM test_case tc
            LEFT JOIN test_case_actions tca ON tca.test_case_id = tc.id
            LEFT JOIN test_actions ta ON ta.id = tca.action_id
            LEFT JOIN test_case_expected_results tcer ON tcer.test_case_id = tc.id
            LEFT JOIN expected_results er ON er.id = tcer.expected_result_id
            WHERE tc.id = $1
            GROUP BY tc.id
        `, [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo caso de prueba con acciones y resultados esperados
const createTestCase = async (req, res) => {
    const { name, importance, summary, preconditions, level_2_id, actions, expected_results } = req.body;
    const client = await pool.connect(); // Conectar el cliente para manejar transacciones
    try {
        await client.query('BEGIN'); // Iniciar la transacción

        // Insertar el caso de prueba
        const result = await client.query(
            'INSERT INTO test_case (name, importance, summary, preconditions, level_2_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, importance, summary, preconditions, level_2_id]
        );
        const testCase = result.rows[0];

        // Validar e insertar acciones asociadas
        if (actions && actions.length > 0) {
            for (let action of actions) {
                // Validar que el action_id exista
                const actionExists = await client.query('SELECT 1 FROM test_actions WHERE id = $1', [action.id]);
                if (actionExists.rowCount === 0) {
                    throw new Error(`Action with id ${action.id} does not exist`);
                }

                // Insertar en test_case_actions
                await client.query(
                    'INSERT INTO test_case_actions (test_case_id, action_id, sequence) VALUES ($1, $2, $3)',
                    [testCase.id, action.id, action.sequence]
                );
            }
        }

        // Validar e insertar resultados esperados asociados
        if (expected_results && expected_results.length > 0) {
            for (let result of expected_results) {
                // Validar que el expected_result_id exista
                const expectedResultExists = await client.query('SELECT 1 FROM expected_results WHERE id = $1', [result.id]);
                if (expectedResultExists.rowCount === 0) {
                    throw new Error(`Expected result with id ${result.id} does not exist`);
                }

                // Insertar en test_case_expected_results
                await client.query(
                    'INSERT INTO test_case_expected_results (test_case_id, expected_result_id) VALUES ($1, $2)',
                    [testCase.id, result.id]
                );
            }
        }

        await client.query('COMMIT'); // Confirmar la transacción
        res.status(201).json(testCase);
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir la transacción en caso de error
        res.status(500).json({ error: error.message });
    } finally {
        client.release(); // Liberar el cliente
    }
};

// Actualizar un caso de prueba con acciones y resultados esperados
const updateTestCase = async (req, res) => {
    const { id } = req.params;
    const { name, importance, summary, preconditions, level_2_id, actions, expected_results } = req.body;
    try {
        const result = await pool.query(
            'UPDATE test_case SET name = $1, importance = $2, summary = $3, preconditions = $4, level_2_id = $5 WHERE id = $6 RETURNING *',
            [name, importance, summary, preconditions, level_2_id, id]
        );
        const testCase = result.rows[0];

        await pool.query('DELETE FROM test_case_actions WHERE test_case_id = $1', [id]);
        await pool.query('DELETE FROM test_case_expected_results WHERE test_case_id = $1', [id]);

        if (actions && actions.length > 0) {
            for (let action of actions) {
                await pool.query(
                    'INSERT INTO test_case_actions (test_case_id, action_id, sequence) VALUES ($1, $2, $3)',
                    [testCase.id, action.id, action.sequence]
                );
            }
        }

        if (expected_results && expected_results.length > 0) {
            for (let result of expected_results) {
                await pool.query(
                    'INSERT INTO test_case_expected_results (test_case_id, expected_result_id) VALUES ($1, $2)',
                    [testCase.id, result.id]
                );
            }
        }

        res.json(testCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un caso de prueba
const deleteTestCase = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM test_case WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTestCases,
    getTestCaseById,
    createTestCase,
    updateTestCase,
    deleteTestCase,
};