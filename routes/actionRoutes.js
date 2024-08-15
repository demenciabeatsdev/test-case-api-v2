const express = require('express');
const router = express.Router();
const {
    getActions,
    getActionById,
    createAction,
    updateAction,
    deleteAction,
} = require('../controllers/actionController');

router.get('/', getActions);
router.get('/:id', getActionById);
router.post('/', createAction);
router.put('/:id', updateAction);
router.delete('/:id', deleteAction);

module.exports = router;