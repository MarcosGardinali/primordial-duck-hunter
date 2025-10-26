const prisma = require('../config/prisma');

class UserRepository {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        height: true,
        weight: true,
        rank: true,
        specialization: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        height: true,
        weight: true,
        rank: true,
        specialization: true,
        emailVerified: true,
        toursCompleted: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        bloodType: true,
        height: true,
        weight: true,
        rank: true,
        specialization: true,
        emailVerified: true,
        toursCompleted: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async create(userData) {
    return prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        height: true,
        weight: true,
        rank: true,
        specialization: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async update(id, userData) {
    return prisma.user.update({
      where: { id: parseInt(id) },
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        height: true,
        weight: true,
        rank: true,
        specialization: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async delete(id) {
    const result = await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    return !!result;
  }

  async emailExists(email, excludeId = null) {
    const where = excludeId 
      ? { email, NOT: { id: parseInt(excludeId) } }
      : { email };
    
    const user = await prisma.user.findFirst({ where });
    return !!user;
  }

  async verifyEmail(userId) {
    return prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        emailVerified: true,
        verificationCode: null,
        codeExpiresAt: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        height: true,
        weight: true,
        rank: true,
        specialization: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async updateVerificationCode(userId, verificationCode, codeExpiresAt) {
    return prisma.user.update({
      where: { id: parseInt(userId) },
      data: { verificationCode, codeExpiresAt },
      select: {
        id: true,
        name: true,
        email: true,
        rank: true
      }
    });
  }

  async updatePassword(userId, hashedPassword) {
    return prisma.user.update({
      where: { id: parseInt(userId) },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true
      }
    });
  }

  async updateToursCompleted(userId, tours) {
    return prisma.user.update({
      where: { id: parseInt(userId) },
      data: { toursCompleted: JSON.stringify(tours) }
    });
  }

}

module.exports = UserRepository;