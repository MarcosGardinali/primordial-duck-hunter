class Drone {
  constructor(data) {
    this.id = data.id;
    this.serial_number = data.serial_number;
    this.brand = data.brand;
    this.manufacturer = data.manufacturer;
    this.country_origin = data.country_origin;
    this.created_at = data.created_at;
  }

  toJSON() {
    return {
      id: this.id,
      serial_number: this.serial_number,
      brand: this.brand,
      manufacturer: this.manufacturer,
      country_origin: this.country_origin,
      created_at: this.created_at
    };
  }
}

module.exports = Drone;