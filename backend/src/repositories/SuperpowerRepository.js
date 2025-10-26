const prisma = require('../config/prisma');

class SuperpowerRepository {
  async findAll() {
    return prisma.superpower.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllPaginated({ page, limit, filters }) {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (filters.name) {
      where.name = { contains: filters.name };
    }
    if (filters.classification) {
      where.classification = filters.classification;
    }
    
    const [data, total] = await Promise.all([
      prisma.superpower.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.superpower.count({ where })
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
    return prisma.superpower.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async create(superpowerData) {
    return prisma.superpower.create({
      data: superpowerData
    });
  }

  async update(id, superpowerData) {
    return await prisma.superpower.update({
      where: { id: parseInt(id) },
      data: superpowerData
    });
  }

  async delete(id) {
    const result = await prisma.superpower.delete({
      where: { id: parseInt(id) }
    });
    return !!result;
  }
}

module.exports = SuperpowerRepository;