const PrimordialDuckRepository = require('../repositories/PrimordialDuckRepository');
const { NotFoundError } = require('../utils/errors');
const { ERROR_MESSAGES } = require('../utils/constants');

class PrimordialDuckService {
  constructor() {
    this.primordialDuckRepository = new PrimordialDuckRepository();
  }

  async getAllDucks(options = {}) {
    if (!options.page) {
      return await this.primordialDuckRepository.findAll();
    }
    
    return await this.primordialDuckRepository.findAllPaginated(options);
  }

  async getDuckById(id) {
    const duck = await this.primordialDuckRepository.findById(id);
    if (!duck) {
      throw new NotFoundError(ERROR_MESSAGES.DUCK_NOT_FOUND);
    }
    return duck;
  }

  async createDuck(duckData) {
    return await this.primordialDuckRepository.create(duckData);
  }

  async updateDuck(id, duckData) {
    const duck = await this.primordialDuckRepository.findById(id);
    if (!duck) {
      throw new NotFoundError(ERROR_MESSAGES.DUCK_NOT_FOUND);
    }

    await this.primordialDuckRepository.update(id, duckData);
    return { message: 'Pato Primordial atualizado com sucesso' };
  }

  async deleteDuck(id) {
    const duck = await this.primordialDuckRepository.findById(id);
    if (!duck) {
      throw new NotFoundError(ERROR_MESSAGES.DUCK_NOT_FOUND);
    }

    await this.primordialDuckRepository.delete(id);
    return { message: 'Pato Primordial deletado com sucesso' };
  }

  async getStats() {
    return await this.primordialDuckRepository.getStats();
  }

  async liberateDuck(id) {
    const duck = await this.primordialDuckRepository.findById(id);
    if (!duck) {
      throw new NotFoundError(ERROR_MESSAGES.DUCK_NOT_FOUND);
    }

    if (!duck.captured) {
      throw new Error('Este pato não está capturado');
    }

    await this.primordialDuckRepository.delete(id);
    return { message: 'Pato Primordial libertado com sucesso' };
  }
}

module.exports = PrimordialDuckService;