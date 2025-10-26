const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Criar superpoder padrão
  const superpower = await prisma.superpower.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Tempestade Elétrica',
      description: 'Gera descargas elétricas em área de até 50 metros',
      classification: 'bélico, raro, alto risco de curto-circuito'
    }
  })

  // Criar drone padrão
  const drone = await prisma.drone.upsert({
    where: { serialNumber: 'DRN-001-USA' },
    update: {},
    create: {
      serialNumber: 'DRN-001-USA',
      brand: 'SkyHawk',
      manufacturer: 'AeroTech Industries',
      countryOrigin: 'Estados Unidos'
    }
  })

  // Criar status do drone padrão
  const droneStatus = await prisma.droneStatus.upsert({
    where: { id: 1 },
    update: {},
    create: {
      battery: 100,
      fuel: 100,
      integrity: 100
    }
  })

  console.log({ superpower, drone, droneStatus })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })