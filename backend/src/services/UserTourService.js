const UserTourRepository = require('../repositories/UserTourRepository');

class UserTourService {
  constructor() {
    this.userTourRepository = new UserTourRepository();
  }

  async markTourCompleted(userId, screenName) {
    return await this.userTourRepository.markTourCompleted(userId, screenName);
  }

  async getUserTours(userId) {
    return await this.userTourRepository.getUserTours(userId);
  }
}

module.exports = UserTourService;