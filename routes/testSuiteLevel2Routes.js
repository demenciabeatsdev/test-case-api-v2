const express = require('express');
const router = express.Router();
const {
    getTestSuitesLevel2,
    getTestSuiteLevel2ById,
    createTestSuiteLevel2,
    updateTestSuiteLevel2,
    deleteTestSuiteLevel2,
    getTestSuitesLevel2ByLevel1Id // Importar la función aquí
} = require('../controllers/testSuiteLevel2Controller');

router.get('/', getTestSuitesLevel2);
router.get('/:id', getTestSuiteLevel2ById);
router.get('/level1/:level1Id', getTestSuitesLevel2ByLevel1Id); // Usar la nueva ruta
router.post('/', createTestSuiteLevel2);
router.put('/:id', updateTestSuiteLevel2);
router.delete('/:id', deleteTestSuiteLevel2);

module.exports = router;
