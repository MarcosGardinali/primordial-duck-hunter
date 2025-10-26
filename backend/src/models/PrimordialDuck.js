class PrimordialDuck {
  constructor(data) {
    this.id = data.id;
    this.nickname = data.nickname;
    this.photo_url = data.photo_url;
    this.drone_id = data.drone_id;
    this.height = data.height;
    this.weight = data.weight;
    this.height_unit = data.height_unit;
    this.weight_unit = data.weight_unit;
    this.city = data.city;
    this.country = data.country;
    this.country_code = data.country_code;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.gps_precision = data.gps_precision;
    this.precision_unit = data.precision_unit;
    this.reference_point = data.reference_point;
    this.hibernation_status = data.hibernation_status;
    this.heart_rate_bpm = data.heart_rate_bpm;
    this.mutations_count = data.mutations_count;
    this.superpower_id = data.superpower_id;
    this.captured = data.captured;
    this.capture_strategy = data.capture_strategy;
    this.capture_date = data.capture_date;
    this.discovered_at = data.discovered_at;
    this.updated_at = data.updated_at;
    // Dados do drone
    this.serial_number = data.serial_number;
    this.brand = data.brand;
    this.manufacturer = data.manufacturer;
    this.country_origin = data.country_origin;
    // Dados do superpoder
    this.superpower_name = data.superpower_name;
    this.superpower_description = data.superpower_description;
  }

  toJSON() {
    return {
      id: this.id,
      nickname: this.nickname,
      photo_url: this.photo_url,
      drone_id: this.drone_id,
      height: this.height,
      weight: this.weight,
      height_unit: this.height_unit,
      weight_unit: this.weight_unit,
      city: this.city,
      country: this.country,
      country_code: this.country_code,
      latitude: this.latitude,
      longitude: this.longitude,
      gps_precision: this.gps_precision,
      precision_unit: this.precision_unit,
      reference_point: this.reference_point,
      hibernation_status: this.hibernation_status,
      heart_rate_bpm: this.heart_rate_bpm,
      mutations_count: this.mutations_count,
      superpower_id: this.superpower_id,
      captured: this.captured,
      capture_strategy: this.capture_strategy,
      capture_date: this.capture_date,
      discovered_at: this.discovered_at,
      updated_at: this.updated_at,
      // Dados do drone
      serial_number: this.serial_number,
      brand: this.brand,
      manufacturer: this.manufacturer,
      country_origin: this.country_origin,
      // Dados do superpoder
      superpower_name: this.superpower_name,
      superpower_description: this.superpower_description
    };
  }
}

module.exports = PrimordialDuck;