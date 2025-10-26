const DroneRepository = require('../repositories/DroneRepository');
const PrimordialDuckRepository = require('../repositories/PrimordialDuckRepository');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { ERROR_MESSAGES } = require('../utils/constants');

class DroneService {
  constructor() {
    this.droneRepository = new DroneRepository();
    this.primordialDuckRepository = new PrimordialDuckRepository();
  }

  transformDroneForFrontend(drone) {
    return {
      id: drone.id,
      serial_number: drone.serialNumber,
      brand: drone.brand,
      manufacturer: drone.manufacturer,
      country_origin: drone.countryOrigin,
      created_at: drone.createdAt
    };
  }

  async getAllDrones(options = {}) {
    try {
      if (!options.page) {
        const drones = await this.droneRepository.findAll();
        return drones.map(drone => this.transformDroneForFrontend(drone));
      }
      
      const result = await this.droneRepository.findAllPaginated(options);
      return {
        data: result.data.map(drone => this.transformDroneForFrontend(drone)),
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error in getAllDrones:', error);
      throw error;
    }
  }

  async getDroneById(id) {
    const drone = await this.droneRepository.findById(id);
    if (!drone) {
      throw new NotFoundError(ERROR_MESSAGES.DRONE_NOT_FOUND);
    }
    return this.transformDroneForFrontend(drone);
  }

  async createDrone(droneData) {
    const existingDrone = await this.droneRepository.findBySerialNumber(droneData.serial_number);
    if (existingDrone) {
      throw new ConflictError('Número de série já existe');
    }
    const drone = await this.droneRepository.create(droneData);
    return this.transformDroneForFrontend(drone);
  }

  async updateDrone(id, droneData) {
    const drone = await this.droneRepository.findById(id);
    if (!drone) {
      throw new NotFoundError(ERROR_MESSAGES.DRONE_NOT_FOUND);
    }

    if (droneData.serial_number !== drone.serialNumber) {
      const existingDrone = await this.droneRepository.findBySerialNumber(droneData.serial_number);
      if (existingDrone) {
        throw new ConflictError('Número de série já existe');
      }
    }

    await this.droneRepository.update(id, droneData);
    return { message: 'Drone atualizado com sucesso' };
  }

  async deleteDrone(id) {
    const drone = await this.droneRepository.findById(id);
    if (!drone) {
      throw new NotFoundError(ERROR_MESSAGES.DRONE_NOT_FOUND);
    }

    const ducksCount = await this.primordialDuckRepository.countByDroneId(id);
    if (ducksCount > 0) {
      throw new ConflictError(ERROR_MESSAGES.DRONE_IN_USE);
    }

    await this.droneRepository.delete(id);
    return { message: 'Drone deletado com sucesso' };
  }

  async getDroneUnits(id) {
    const drone = await this.droneRepository.findById(id);
    if (!drone) {
      throw new NotFoundError(ERROR_MESSAGES.DRONE_NOT_FOUND);
    }

    const country = drone.countryOrigin.toLowerCase();
    const isUSA = country === 'eua' || country === 'usa' || country === 'estados unidos';
    
    return {
      height_unit: isUSA ? 'ft' : 'cm',
      weight_unit: isUSA ? 'lb' : 'g',
      precision_unit: isUSA ? 'yd' : 'cm'
    };
  }
}

module.exports = DroneService;