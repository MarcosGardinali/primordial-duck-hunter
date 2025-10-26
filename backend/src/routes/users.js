const express = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const handleValidation = require('../middleware/validation');
const { createUserValidation, updateUserValidation } = require('../validators/userValidator');

const router = express.Router();
const userController = new UserController();

router.get('/', auth, userController.getAll.bind(userController));
router.get('/:id', auth, userController.getById.bind(userController));
router.post('/', createUserValidation, handleValidation, userController.create.bind(userController));
router.put('/:id', auth, updateUserValidation, handleValidation, userController.update.bind(userController));
router.delete('/:id', auth, userController.delete.bind(userController));
router.patch('/tours', auth, userController.updateTours.bind(userController));

module.exports = router;