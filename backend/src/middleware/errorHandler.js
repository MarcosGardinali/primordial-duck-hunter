const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }



  return res.status(500).json({
    message: 'Erro interno do servidor'
  });
};

module.exports = errorHandler;