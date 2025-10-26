class Superpower {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.classification = data.classification;
    this.created_at = data.created_at;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      classification: this.classification,
      created_at: this.created_at
    };
  }
}

module.exports = Superpower;