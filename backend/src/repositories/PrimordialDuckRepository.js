const prisma = require('../config/prisma');
const { HIBERNATION_STATUS } = require('../utils/enums');

class PrimordialDuckRepository {
  async findAll() {
    return prisma.primordialDuck.findMany({
      include: {
        drone: true,
        superpower: true
      },
      orderBy: { discoveredAt: 'desc' }
    });
  }

  async findAllPaginated({ page, limit, filters }) {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (filters.nickname) {
      where.nickname = { contains: filters.nickname };
    }
    if (filters.hibernation_status) {
      where.hibernationStatus = filters.hibernation_status;
    }
    if (filters.country) {
      where.country = { contains: filters.country };
    }
    if (filters.mutations_count_min) {
      where.mutationsCount = { gte: parseInt(filters.mutations_count_min) };
    }
    if (filters.mutations_count_max) {
      if (where.mutationsCount) {
        where.mutationsCount.lte = parseInt(filters.mutations_count_max);
      } else {
        where.mutationsCount = { lte: parseInt(filters.mutations_count_max) };
      }
    }
    
    const [data, total] = await Promise.all([
      prisma.primordialDuck.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          drone: true,
          superpower: true
        },
        orderBy: { discoveredAt: 'desc' }
      }),
      prisma.primordialDuck.count({ where })
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
  }

  async findById(id) {
    return prisma.primordialDuck.findUnique({
      where: { id: parseInt(id) },
      include: {
        drone: true,
        superpower: true
      }
    });
  }

  async create(duckData) {
    return prisma.primordialDuck.create({
      data: {
        nickname: duckData.nickname || null,
        photoUrl: duckData.photo_url || null,
        droneId: parseInt(duckData.drone_id),
        height: parseFloat(duckData.height),
        weight: parseFloat(duckData.weight),
        heightUnit: duckData.height_unit || 'cm',
        weightUnit: duckData.weight_unit || 'g',
        city: duckData.city,
        country: duckData.country,
        countryCode: duckData.country_code || null,
        latitude: parseFloat(duckData.latitude),
        longitude: parseFloat(duckData.longitude),
        gpsPrecision: parseFloat(duckData.gps_precision),
        precisionUnit: duckData.precision_unit || 'cm',
        referencePoint: duckData.reference_point || null,
        hibernationStatus: duckData.hibernation_status,
        heartRateBpm: duckData.heart_rate_bpm ? parseInt(duckData.heart_rate_bpm) : null,
        mutationsCount: parseInt(duckData.mutations_count) || 0,
        superpowerId: duckData.superpower_id ? parseInt(duckData.superpower_id) : null
      },
      include: {
        drone: true,
        superpower: true
      }
    });
  }

  async update(id, duckData) {
    const result = await prisma.primordialDuck.update({
      where: { id: parseInt(id) },
      data: {
        nickname: duckData.nickname || null,
        photoUrl: duckData.photo_url || null,
        droneId: parseInt(duckData.drone_id),
        height: parseFloat(duckData.height),
        weight: parseFloat(duckData.weight),
        heightUnit: duckData.height_unit || 'cm',
        weightUnit: duckData.weight_unit || 'g',
        city: duckData.city,
        country: duckData.country,
        countryCode: duckData.country_code || null,
        latitude: parseFloat(duckData.latitude),
        longitude: parseFloat(duckData.longitude),
        gpsPrecision: parseFloat(duckData.gps_precision),
        precisionUnit: duckData.precision_unit || 'cm',
        referencePoint: duckData.reference_point || null,
        hibernationStatus: duckData.hibernation_status,
        heartRateBpm: duckData.heart_rate_bpm ? parseInt(duckData.heart_rate_bpm) : null,
        mutationsCount: parseInt(duckData.mutations_count) || 0,
        superpowerId: duckData.superpower_id ? parseInt(duckData.superpower_id) : null
      }
    });
    return !!result;
  }

  async delete(id) {
    const result = await prisma.primordialDuck.delete({
      where: { id: parseInt(id) }
    });
    return !!result;
  }

  async countByDroneId(droneId) {
    return prisma.primordialDuck.count({
      where: { droneId: parseInt(droneId) }
    });
  }

  async countBySuperpowerId(superpowerId) {
    return prisma.primordialDuck.count({
      where: { superpowerId: parseInt(superpowerId) }
    });
  }

  async getStats() {
    const total = await prisma.primordialDuck.count();
    const despertos = await prisma.primordialDuck.count({ where: { hibernationStatus: HIBERNATION_STATUS.DESPERTO } });
    const em_transe = await prisma.primordialDuck.count({ where: { hibernationStatus: HIBERNATION_STATUS.EM_TRANSE } });
    const hibernacao_profunda = await prisma.primordialDuck.count({ where: { hibernationStatus: HIBERNATION_STATUS.HIBERNACAO_PROFUNDA } });
    const capturados = await prisma.primordialDuck.count({ where: { captured: true } });
    
    const avgMutations = await prisma.primordialDuck.aggregate({
      _avg: { mutationsCount: true }
    });

    const byStatus = await prisma.primordialDuck.groupBy({
      by: ['hibernationStatus'],
      _count: { hibernationStatus: true }
    });

    const last7Days = await prisma.$queryRaw`
      SELECT DATE(discovered_at) as date, COUNT(*) as count
      FROM primordial_ducks
      WHERE discovered_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(discovered_at)
      ORDER BY date
    `;

    const recentDucks = await prisma.primordialDuck.findMany({
      take: 10,
      orderBy: { discoveredAt: 'desc' },
      include: {
        drone: true,
        superpower: true
      }
    });

    return {
      total,
      despertos,
      em_transe,
      hibernacao_profunda,
      capturados,
      avg_mutations: avgMutations._avg.mutationsCount,
      by_status: byStatus.map(item => ({
        hibernation_status: item.hibernationStatus,
        count: Number(item._count.hibernationStatus)
      })),
      last_7_days: last7Days.map(item => ({
        date: item.date,
        count: Number(item.count)
      })),
      recent_ducks: recentDucks,
      mutations: {
        avg_mutations: avgMutations._avg.mutationsCount
      }
    };
  }
}

module.exports = PrimordialDuckRepository;