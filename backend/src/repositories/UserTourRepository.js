const prisma = require('../config/prisma');

class UserTourRepository {
  async markTourCompleted(userId, screenName) {
    await prisma.userTour.upsert({
      where: {
        userId_screenName: {
          userId: parseInt(userId),
          screenName: screenName
        }
      },
      update: {},
      create: {
        userId: parseInt(userId),
        screenName: screenName
      }
    });
  }

  async getUserTours(userId) {
    const tours = await prisma.userTour.findMany({
      where: { userId: parseInt(userId) },
      select: { screenName: true }
    });
    return tours.map(tour => tour.screenName);
  }
}

module.exports = UserTourRepository;