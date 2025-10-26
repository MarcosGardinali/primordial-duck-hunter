const database = require('./src/config/database');

const initDatabase = async () => {
  try {
    // Tabela de usuários
    await database.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tabela de drones
    await database.execute(`
      CREATE TABLE IF NOT EXISTS drones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serial_number VARCHAR(100) UNIQUE NOT NULL,
        brand VARCHAR(100) NOT NULL,
        manufacturer VARCHAR(100) NOT NULL,
        country_origin VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de superpoderes
    await database.execute(`
      CREATE TABLE IF NOT EXISTS superpowers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        classification VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela principal dos Patos Primordiais
    await database.execute(`
      CREATE TABLE IF NOT EXISTS primordial_ducks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nickname VARCHAR(255),
        photo_url VARCHAR(255),
        drone_id INT NOT NULL,
        height DECIMAL(10,2) NOT NULL,
        weight DECIMAL(10,2) NOT NULL,
        height_unit VARCHAR(10) DEFAULT 'cm',
        weight_unit VARCHAR(10) DEFAULT 'g',
        city VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        gps_precision DECIMAL(10,2) NOT NULL,
        precision_unit VARCHAR(10) DEFAULT 'cm',
        reference_point VARCHAR(255),
        hibernation_status ENUM('desperto', 'em_transe', 'hibernacao_profunda') NOT NULL,
        heart_rate_bpm INT,
        mutations_count INT NOT NULL DEFAULT 0,
        superpower_id INT,
        captured BOOLEAN DEFAULT FALSE,
        capture_strategy VARCHAR(255),
        capture_date TIMESTAMP NULL,
        discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (drone_id) REFERENCES drones(id) ON DELETE CASCADE,
        FOREIGN KEY (superpower_id) REFERENCES superpowers(id) ON DELETE SET NULL
      )
    `);
    
    // Tabela de status do drone
    await database.execute(`
      CREATE TABLE IF NOT EXISTS drone_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        battery INT DEFAULT 100,
        fuel INT DEFAULT 100,
        integrity INT DEFAULT 100,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Inserir status inicial se não existir
    const [droneExists] = await database.execute('SELECT COUNT(*) as count FROM drone_status');
    if (droneExists[0].count === 0) {
      await database.execute(`
        INSERT INTO drone_status (battery, fuel, integrity) 
        VALUES (100, 100, 100)
      `);
    }

    // Inserir dados padrão
    await database.execute(`
      INSERT IGNORE INTO superpowers (name, description, classification) 
      VALUES ('Tempestade Elétrica', 'Gera descargas elétricas em área de até 50 metros', 'bélico, raro, alto risco de curto-circuito')
    `);

    await database.execute(`
      INSERT IGNORE INTO drones (serial_number, brand, manufacturer, country_origin) 
      VALUES ('DRN-001-USA', 'SkyHawk', 'AeroTech Industries', 'Estados Unidos')
    `);
    
  } catch (error) {
  }
};

module.exports = { initDatabase };