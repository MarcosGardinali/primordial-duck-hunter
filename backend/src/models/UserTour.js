class UserTour {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.screen_name = data.screen_name;
    this.completed_at = data.completed_at;
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      screen_name: this.screen_name,
      completed_at: this.completed_at
    };
  }
}

module.exports = UserTour;