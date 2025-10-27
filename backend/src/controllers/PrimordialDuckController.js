const PrimordialDuckService = require('../services/PrimordialDuckService');
const { HTTP_STATUS } = require('../utils/constants');

class PrimordialDuckController {
  constructor() {
    this.primordialDuckService = new PrimordialDuckService();
  }

  transformDuckForFrontend(duck) {
    return {
      id: duck.id,
      nickname: duck.nickname,
      photo_url: duck.photoUrl,
      drone_id: duck.droneId,
      height: duck.height,
      weight: duck.weight,
      height_unit: duck.heightUnit,
      weight_unit: duck.weightUnit,
      city: duck.city,
      country: duck.country,
      country_code: duck.countryCode,
      latitude: duck.latitude,
      longitude: duck.longitude,
      gps_precision: duck.gpsPrecision,
      precision_unit: duck.precisionUnit,
      reference_point: duck.referencePoint,
      hibernation_status: duck.hibernationStatus,
      heart_rate_bpm: duck.heartRateBpm,
      mutations_count: duck.mutationsCount,
      superpower_id: duck.superpowerId,
      captured: duck.captured,
      capture_strategy: duck.captureStrategy,
      capture_defense: duck.captureDefense,
      capture_date: duck.captureDate,
      discovered_at: duck.discoveredAt,
      updated_at: duck.updatedAt,
      // Relacionamentos
      serial_number: duck.drone?.serialNumber,
      brand: duck.drone?.brand,
      manufacturer: duck.drone?.manufacturer,
      country_origin: duck.drone?.countryOrigin,
      superpower_name: duck.superpower?.name,
      superpower_description: duck.superpower?.description,
      superpower_classification: duck.superpower?.classification
    };
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const result = await this.primordialDuckService.getAllDucks({
        page: parseInt(page),
        limit: parseInt(limit),
        filters
      });
      const transformedDucks = result.data.map(duck => this.transformDuckForFrontend(duck));
      res.json({
        data: transformedDucks,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const duck = await this.primordialDuckService.getDuckById(req.params.id);
      const transformedDuck = this.transformDuckForFrontend(duck);
      res.json(transformedDuck);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const duck = await this.primordialDuckService.createDuck(req.body);
      const transformedDuck = this.transformDuckForFrontend(duck);
      res.status(HTTP_STATUS.CREATED).json(transformedDuck);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.primordialDuckService.updateDuck(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await this.primordialDuckService.deleteDuck(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await this.primordialDuckService.getStats();
      // Transformar recent_ducks se existir
      if (stats.recent_ducks) {
        stats.recent_ducks = stats.recent_ducks.map(duck => this.transformDuckForFrontend(duck));
      }
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async liberate(req, res, next) {
    try {
      const result = await this.primordialDuckService.liberateDuck(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PrimordialDuckController;