const prisma = require('../config/prisma');

class DroneRepository {
  async findAll() {
    return prisma.drone.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllPaginated({ page, limit, filters }) {
    try {
      const offset = (page - 1) * limit;
      const where = {};
      
      if (filters.serial_number && filters.serial_number.trim()) {
        where.serialNumber = { contains: filters.serial_number.trim() };
      }
      if (filters.brand && filters.brand.trim()) {
        where.brand = { contains: filters.brand.trim() };
      }
      if (filters.manufacturer && filters.manufacturer.trim()) {
        where.manufacturer = { contains: filters.manufacturer.trim() };
      }
      if (filters.country_origin && filters.country_origin.trim()) {
        where.countryOrigin = { contains: filters.country_origin.trim() };
      }
      
      const [data, total] = await Promise.all([
        prisma.drone.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.drone.count({ where })
      ]);
      
      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in findAllPaginated:', error);
      throw error;
    }
  }

  async findById(id) {
    return prisma.drone.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async create(droneData) {
    return prisma.drone.create({
      data: {
        serialNumber: droneData.serial_number,
        brand: droneData.brand,
        manufacturer: droneData.manufacturer,
        countryOrigin: droneData.country_origin
      }
    });
  }

  async update(id, droneData) {
    const result = await prisma.drone.update({
      where: { id: parseInt(id) },
      data: {
        serialNumber: droneData.serial_number,
        brand: droneData.brand,
        manufacturer: droneData.manufacturer,
        countryOrigin: droneData.country_origin
      }
    });
    return !!result;
  }

  async delete(id) {
    const result = await prisma.drone.delete({
      where: { id: parseInt(id) }
    });
    return !!result;
  }

  async findBySerialNumber(serialNumber) {
    return prisma.drone.findUnique({
      where: { serialNumber }
    });
  }
}

module.exports = DroneRepository;