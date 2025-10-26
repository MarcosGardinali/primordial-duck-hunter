const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'Usuário não encontrado',
  EMAIL_ALREADY_EXISTS: 'Email já cadastrado',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  TOKEN_NOT_PROVIDED: 'Token não fornecido',
  INVALID_TOKEN: 'Token inválido',
  INTERNAL_SERVER_ERROR: 'Erro interno do servidor',
  DRONE_NOT_FOUND: 'Drone não encontrado',
  SUPERPOWER_NOT_FOUND: 'Superpoder não encontrado',
  DUCK_NOT_FOUND: 'Pato Primordial não encontrado',
  DRONE_IN_USE: 'Não é possível excluir este drone pois ele está vinculado a patos primordiais. Capture os patos para estudo e depois liberte-os antes de excluir o drone.',
  SUPERPOWER_IN_USE: 'Não é possível excluir este superpoder pois ele está vinculado a patos primordiais. Capture os patos para estudo e depois liberte-os antes de excluir o superpoder.',
  INVALID_HIBERNATION_STATUS: 'Status de hibernação deve ser: desperto, em_transe ou hibernacao_profunda'
};

const SUCCESS_MESSAGES = {
  USER_CREATED: 'Usuário criado com sucesso',
  LOGIN_SUCCESS: 'Login realizado com sucesso'
};

const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES
};