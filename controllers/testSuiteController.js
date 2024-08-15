const pool = require('../config/database');

// Obtener todas las suites de nivel 1
const getTestSuitesLevel1 = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM test_suite_level_1');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una suite de nivel 1 por ID
const getTestSuiteLevel1ById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM test_suite_level_1 WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva suite de nivel 1
const createTestSuiteLevel1 = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO test_suite_level_1 (name) VALUES ($1) RETURNING *',
            [name]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Test Suite Level 1 not Create' });
        }

        res.status(201).json({
            message: 'Test Suite Level 1 was successfully created.',
            data: result.rows[0]
        });
        
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una suite de nivel 1
const updateTestSuiteLevel1 = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE test_suite_level_1 SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Test Suite Level 1 not found' });
        }

        res.json({
            message: 'Test Suite Level 1 was successfully updated.',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: `Failed to update Test Suite Level 1: ${error.message}` });
    }
};


// Eliminar una suite de nivel 1
const deleteTestSuiteLevel1 = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM test_suite_level_1 WHERE id = $1 RETURNING *', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Test Suite Level 1 not found' });
        }

        res.status(200).json({ message: `Test Suite Level 1 with ID ${id} was successfully deleted.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getTestSuitesLevel1,
    getTestSuiteLevel1ById,
    createTestSuiteLevel1,
    updateTestSuiteLevel1,
    deleteTestSuiteLevel1,
};