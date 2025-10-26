const express = require('express');
const SuperpowerController = require('../controllers/SuperpowerController');
const auth = require('../middleware/auth');
const handleValidation = require('../middleware/validation');
const { superpowerValidation } = require('../validators/superpowerValidator');

const router = express.Router();
const superpowerController = new SuperpowerController();

router.get('/', auth, superpowerController.getAll.bind(superpowerController));

router.get('/:id', auth, superpowerController.getById.bind(superpowerController));
router.post('/', auth, superpowerValidation, handleValidation, superpowerController.create.bind(superpowerController));
router.put('/:id', auth, superpowerValidation, handleValidation, superpowerController.update.bind(superpowerController));
router.delete('/:id', auth, superpowerController.delete.bind(superpowerController));

module.exports = router;