// Arquivo temporário para compatibilidade
const prisma = require('./src/config/prisma');

const initDatabase = async () => {
  try {
    // Usar Prisma para verificar conexão
    await prisma.$connect();

    
    // Inserir dados padrão usando Prisma
    await prisma.superpower.upsert({
      where: { name: 'Tempestade Elétrica' },
      update: {},
      create: {
        name: 'Tempestade Elétrica',
        description: 'Gera descargas elétricas em área de até 50 metros',
        classification: 'bélico, raro, alto risco de curto-circuito'
      }
    });

    await prisma.drone.upsert({
      where: { serialNumber: 'DRN-001-USA' },
      update: {},
      create: {
        serialNumber: 'DRN-001-USA',
        brand: 'SkyHawk',
        manufacturer: 'AeroTech Industries',
        countryOrigin: 'Estados Unidos'
      }
    });

    // Verificar se existe status do drone
    const droneStatus = await prisma.droneStatus.findFirst();
    if (!droneStatus) {
      await prisma.droneStatus.create({
        data: {
          battery: 100,
          fuel: 100,
          integrity: 100
        }
      });
    }
    
  } catch (error) {
  }
};

// Mock do pool para compatibilidade
const pool = {
  getConnection: async () => ({
    execute: () => {},
    release: () => {}
  })
};

module.exports = { initDatabase, pool };