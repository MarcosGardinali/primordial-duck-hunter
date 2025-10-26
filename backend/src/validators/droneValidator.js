const { body } = require('express-validator');

const droneValidation = [
  body('serial_number').notEmpty().withMessage('Número de série é obrigatório'),
  body('brand').notEmpty().withMessage('Marca é obrigatória'),
  body('manufacturer').notEmpty().withMessage('Fabricante é obrigatório'),
  body('country_origin').notEmpty().withMessage('País de origem é obrigatório')
];

module.exports = {
  droneValidation
};