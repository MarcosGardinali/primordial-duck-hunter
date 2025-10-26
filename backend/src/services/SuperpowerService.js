const SuperpowerRepository = require('../repositories/SuperpowerRepository');
const PrimordialDuckRepository = require('../repositories/PrimordialDuckRepository');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { ERROR_MESSAGES } = require('../utils/constants');

class SuperpowerService {
  constructor() {
    this.superpowerRepository = new SuperpowerRepository();
    this.primordialDuckRepository = new PrimordialDuckRepository();
  }

  transformSuperpowerForFrontend(superpower) {
    return {
      id: superpower.id,
      name: superpower.name,
      description: superpower.description,
      classification: superpower.classification,
      created_at: superpower.createdAt
    };
  }

  async getAllSuperpowers(options = {}) {
    if (!options.page) {
      const superpowers = await this.superpowerRepository.findAll();
      return superpowers.map(superpower => this.transformSuperpowerForFrontend(superpower));
    }
    
    const result = await this.superpowerRepository.findAllPaginated(options);
    return {
      data: result.data.map(superpower => this.transformSuperpowerForFrontend(superpower)),
      pagination: result.pagination
    };
  }

  async getSuperpowerById(id) {
    const superpower = await this.superpowerRepository.findById(id);
    if (!superpower) {
      throw new NotFoundError(ERROR_MESSAGES.SUPERPOWER_NOT_FOUND);
    }
    return this.transformSuperpowerForFrontend(superpower);
  }

  async createSuperpower(superpowerData) {
    const superpower = await this.superpowerRepository.create(superpowerData);
    return this.transformSuperpowerForFrontend(superpower);
  }

  async updateSuperpower(id, superpowerData) {
    const superpower = await this.superpowerRepository.findById(id);
    if (!superpower) {
      throw new NotFoundError(ERROR_MESSAGES.SUPERPOWER_NOT_FOUND);
    }

    // Remove created_at from the update data
    const { created_at, ...updateData } = superpowerData;

    const updatedSuperpower = await this.superpowerRepository.update(id, updateData);
    return this.transformSuperpowerForFrontend(updatedSuperpower);
  }

  async deleteSuperpower(id) {
    const superpower = await this.superpowerRepository.findById(id);
    if (!superpower) {
      throw new NotFoundError(ERROR_MESSAGES.SUPERPOWER_NOT_FOUND);
    }

    const ducksCount = await this.primordialDuckRepository.countBySuperpowerId(id);
    if (ducksCount > 0) {
      throw new ConflictError(ERROR_MESSAGES.SUPERPOWER_IN_USE);
    }

    await this.superpowerRepository.delete(id);
    return { message: 'Superpoder deletado com sucesso' };
  }
}

module.exports = SuperpowerService;