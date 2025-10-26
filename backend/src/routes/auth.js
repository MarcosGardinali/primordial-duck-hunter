const express = require('express');
const AuthController = require('../controllers/AuthController');
const handleValidation = require('../middleware/validation');
const { loginValidation, registerValidation } = require('../validators/authValidator');

const router = express.Router();
const authController = new AuthController();

router.post('/register', registerValidation, handleValidation, authController.register.bind(authController));
router.post('/request-reset', authController.requestPasswordReset.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.post('/login', loginValidation, handleValidation, authController.login.bind(authController));

module.exports = router;