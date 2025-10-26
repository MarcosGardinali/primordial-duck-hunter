const SuperpowerService = require('../services/SuperpowerService');
const { HTTP_STATUS } = require('../utils/constants');

class SuperpowerController {
  constructor() {
    this.superpowerService = new SuperpowerService();
  }

  async getAll(req, res, next) {
    try {
      const { page, limit = 10, all, ...filters } = req.query;
      
      if (all === 'true') {
        const superpowers = await this.superpowerService.getAllSuperpowers();
        res.json(superpowers);
        return;
      }
      
      const result = await this.superpowerService.getAllSuperpowers({
        page: parseInt(page || 1),
        limit: parseInt(limit),
        filters
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }



  async getById(req, res, next) {
    try {
      const superpower = await this.superpowerService.getSuperpowerById(req.params.id);
      res.json(superpower);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const superpower = await this.superpowerService.createSuperpower(req.body);
      res.status(HTTP_STATUS.CREATED).json(superpower);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.superpowerService.updateSuperpower(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await this.superpowerService.deleteSuperpower(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SuperpowerController;