const DroneService = require('../services/DroneService');
const { HTTP_STATUS } = require('../utils/constants');

class DroneController {
  constructor() {
    this.droneService = new DroneService();
  }

  async getAll(req, res, next) {
    try {
      const { page, limit = 10, all, ...filters } = req.query;
      
      if (all === 'true') {
        const drones = await this.droneService.getAllDrones();
        res.json(drones);
        return;
      }
      
      const result = await this.droneService.getAllDrones({
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
      const drone = await this.droneService.getDroneById(req.params.id);
      res.json(drone);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const drone = await this.droneService.createDrone(req.body);
      res.status(HTTP_STATUS.CREATED).json(drone);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.droneService.updateDrone(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await this.droneService.deleteDrone(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUnits(req, res, next) {
    try {
      const units = await this.droneService.getDroneUnits(req.params.id);
      res.json(units);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DroneController;