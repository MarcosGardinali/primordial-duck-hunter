const express = require('express');
const DroneController = require('../controllers/DroneController');
const auth = require('../middleware/auth');
const handleValidation = require('../middleware/validation');
const { droneValidation } = require('../validators/droneValidator');

const router = express.Router();
const droneController = new DroneController();

router.get('/', auth, droneController.getAll.bind(droneController));

router.get('/:id', auth, droneController.getById.bind(droneController));
router.post('/', auth, droneValidation, handleValidation, droneController.create.bind(droneController));
router.put('/:id', auth, droneValidation, handleValidation, droneController.update.bind(droneController));
router.delete('/:id', auth, droneController.delete.bind(droneController));
router.get('/:id/units', auth, droneController.getUnits.bind(droneController));

module.exports = router;