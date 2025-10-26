const UserTourService = require('../services/UserTourService');

class UserTourController {
  constructor() {
    this.userTourService = new UserTourService();
  }

  async markTourCompleted(req, res, next) {
    try {
      const { screen_name } = req.body;
      await this.userTourService.markTourCompleted(req.user.id, screen_name);
      res.json({ message: 'Tour marcado como completo' });
    } catch (error) {
      next(error);
    }
  }

  async getUserTours(req, res, next) {
    try {
      const tours = await this.userTourService.getUserTours(req.user.id);
      res.json({ completed_tours: tours });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserTourController;