const express = require('express');
const router = express.Router();
const {
    getTestSuitesLevel1,
    getTestSuiteLevel1ById,
    createTestSuiteLevel1,
    updateTestSuiteLevel1,
    deleteTestSuiteLevel1,
} = require('../controllers/testSuiteController');

router.get('/', getTestSuitesLevel1);
router.get('/:id', getTestSuiteLevel1ById);
router.post('/', createTestSuiteLevel1);
router.put('/:id', updateTestSuiteLevel1);
router.delete('/:id', deleteTestSuiteLevel1);

module.exports = router;