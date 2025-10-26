const { body } = require('express-validator');
const { VALIDATION_RULES } = require('../utils/constants');

const createUserValidation = [
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: VALIDATION_RULES.NAME_MIN_LENGTH, max: VALIDATION_RULES.NAME_MAX_LENGTH })
    .withMessage(`Nome deve ter entre ${VALIDATION_RULES.NAME_MIN_LENGTH} e ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: VALIDATION_RULES.PASSWORD_MIN_LENGTH })
    .withMessage(`Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`)
];

const updateUserValidation = [
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: VALIDATION_RULES.NAME_MIN_LENGTH, max: VALIDATION_RULES.NAME_MAX_LENGTH })
    .withMessage(`Nome deve ter entre ${VALIDATION_RULES.NAME_MIN_LENGTH} e ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
];

module.exports = {
  createUserValidation,
  updateUserValidation
};