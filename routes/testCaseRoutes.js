const express = require('express');
const router = express.Router();
const {
    getTestCases,
    getTestCaseById,
    createTestCase,
    updateTestCase,
    deleteTestCase,
} = require('../controllers/testCaseController');

router.get('/', getTestCases);
router.get('/:id', getTestCaseById);
router.post('/', createTestCase);
router.put('/:id', updateTestCase);
router.delete('/:id', deleteTestCase);

module.exports = router;