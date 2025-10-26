class User {
  constructor({ id, name, email, password, bloodType, height, weight, rank, specialization, emailVerified, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.bloodType = bloodType;
    this.height = height;
    this.weight = weight;
    this.rank = rank;
    this.specialization = specialization;
    this.emailVerified = emailVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ name, email, password, bloodType, height, weight, rank, specialization }) {
    return new User({ name, email, password, bloodType, height, weight, rank, specialization });
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;