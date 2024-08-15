const express = require('express');
const router = express.Router();
const {
    getExpectedResults,
    getExpectedResultById,
    createExpectedResult,
    updateExpectedResult,
    deleteExpectedResult,
} = require('../controllers/expectedResultController');

router.get('/', getExpectedResults);
router.get('/:id', getExpectedResultById);
router.post('/', createExpectedResult);
router.put('/:id', updateExpectedResult);
router.delete('/:id', deleteExpectedResult);

module.exports = router;