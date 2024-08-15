const pool = require('../config/database');

// Obtener todas las suites de nivel 2
const getTestSuitesLevel2 = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM test_suite_level_2');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una suite de nivel 2 por ID
const getTestSuiteLevel2ById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM test_suite_level_2 WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva suite de nivel 2
const createTestSuiteLevel2 = async (req, res) => {
    const { name, level_1_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO test_suite_level_2 (name, level_1_id) VALUES ($1, $2) RETURNING *',
            [name, level_1_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una suite de nivel 2
const updateTestSuiteLevel2 = async (req, res) => {
    const { id } = req.params;
    const { name, level_1_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE test_suite_level_2 SET name = $1, level_1_id = $2 WHERE id = $3 RETURNING *',
            [name, level_1_id, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una suite de nivel 2
const deleteTestSuiteLevel2 = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM test_suite_level_2 WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTestSuitesLevel2,
    getTestSuiteLevel2ById,
    createTestSuiteLevel2,
    updateTestSuiteLevel2,
    deleteTestSuiteLevel2,
};