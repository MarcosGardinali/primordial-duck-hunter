const { body } = require('express-validator');

const superpowerValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('classification').notEmpty().withMessage('Classificação é obrigatória')
];

module.exports = {
  superpowerValidation
};