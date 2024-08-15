const pool = require('../config/database');

// Obtener todos los resultados esperados
const getExpectedResults = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expected_results');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un resultado esperado por ID
const getExpectedResultById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM expected_results WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo resultado esperado
const createExpectedResult = async (req, res) => {
    const { description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO expected_results (description) VALUES ($1) RETURNING *',
            [description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un resultado esperado
const updateExpectedResult = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE expected_results SET description = $1 WHERE id = $2 RETURNING *',
            [description, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un resultado esperado
const deleteExpectedResult = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM expected_results WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getExpectedResults,
    getExpectedResultById,
    createExpectedResult,
    updateExpectedResult,
    deleteExpectedResult,
};