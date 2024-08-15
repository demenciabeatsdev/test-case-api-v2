const express = require('express');
const router = express.Router();
const {
    getTestSuitesLevel2,
    getTestSuiteLevel2ById,
    createTestSuiteLevel2,
    updateTestSuiteLevel2,
    deleteTestSuiteLevel2,
} = require('../controllers/testSuiteLevel2Controller');

router.get('/', getTestSuitesLevel2);
router.get('/:id', getTestSuiteLevel2ById);
router.post('/', createTestSuiteLevel2);
router.put('/:id', updateTestSuiteLevel2);
router.delete('/:id', deleteTestSuiteLevel2);

module.exports = router;