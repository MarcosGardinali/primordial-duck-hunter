const express = require('express');
const PrimordialDuckController = require('../controllers/PrimordialDuckController');
const auth = require('../middleware/auth');
const handleValidation = require('../middleware/validation');
const { primordialDuckValidation } = require('../validators/primordialDuckValidator');

const router = express.Router();
const primordialDuckController = new PrimordialDuckController();

router.get('/', auth, primordialDuckController.getAll.bind(primordialDuckController));
router.get('/stats/overview', auth, primordialDuckController.getStats.bind(primordialDuckController));
router.get('/:id', auth, primordialDuckController.getById.bind(primordialDuckController));
router.post('/', auth, primordialDuckValidation, handleValidation, primordialDuckController.create.bind(primordialDuckController));
router.put('/:id', auth, primordialDuckValidation, handleValidation, primordialDuckController.update.bind(primordialDuckController));
router.delete('/:id', auth, primordialDuckController.delete.bind(primordialDuckController));
router.delete('/:id/liberate', auth, primordialDuckController.liberate.bind(primordialDuckController));

module.exports = router;