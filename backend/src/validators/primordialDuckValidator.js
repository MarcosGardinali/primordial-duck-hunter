const { body } = require('express-validator');
const { HIBERNATION_STATUS_VALUES, HIBERNATION_STATUS } = require('../utils/enums');

const primordialDuckValidation = [
  body('nickname').notEmpty().withMessage('Apelido é obrigatório'),
  body('photo_url').optional().isString().withMessage('URL da foto deve ser uma string'),
  body('drone_id').notEmpty().withMessage('Drone é obrigatório').isInt().withMessage('ID do drone deve ser um número'),
  body('height').notEmpty().withMessage('Altura é obrigatória').isFloat({ min: 0 }).withMessage('Altura deve ser um número positivo'),
  body('height_unit').notEmpty().withMessage('Unidade de altura é obrigatória'),
  body('weight').notEmpty().withMessage('Peso é obrigatório').isFloat({ min: 0 }).withMessage('Peso deve ser um número positivo'),
  body('weight_unit').notEmpty().withMessage('Unidade de peso é obrigatória'),
  body('city').notEmpty().withMessage('Cidade é obrigatória'),
  body('country').notEmpty().withMessage('País é obrigatório'),
  body('latitude').notEmpty().withMessage('Latitude é obrigatória').isFloat({ min: -90, max: 90 }).withMessage('Latitude inválida'),
  body('longitude').notEmpty().withMessage('Longitude é obrigatória').isFloat({ min: -180, max: 180 }).withMessage('Longitude inválida'),
  body('gps_precision').notEmpty().withMessage('Precisão GPS é obrigatória').isFloat({ min: 0 }).withMessage('Precisão GPS deve ser positiva'),
  body('precision_unit').notEmpty().withMessage('Unidade de precisão é obrigatória'),
  body('reference_point').notEmpty().withMessage('Ponto de referência é obrigatório'),
  body('hibernation_status').notEmpty().withMessage('Status de hibernação é obrigatório').isIn(HIBERNATION_STATUS_VALUES).withMessage('Status de hibernação inválido'),
  body('mutations_count').notEmpty().withMessage('Quantidade de mutações é obrigatória').isInt({ min: 0 }).withMessage('Número de mutações deve ser positivo'),
  // Validações condicionais
  body('heart_rate_bpm').custom((value, { req }) => {
    const status = req.body.hibernation_status;
    if (status === HIBERNATION_STATUS.EM_TRANSE || status === HIBERNATION_STATUS.HIBERNACAO_PROFUNDA) {
      if (!value || value <= 0) {
        throw new Error('Batimentos cardíacos são obrigatórios para patos em transe ou hibernação');
      }
    }
    return true;
  }),
  body('superpower_id').custom((value, { req }) => {
    const status = req.body.hibernation_status;
    if (status === HIBERNATION_STATUS.DESPERTO) {
      if (!value) {
        throw new Error('Superpoder é obrigatório para patos despertos');
      }
    }
    return true;
  })
];

module.exports = {
  primordialDuckValidation
};