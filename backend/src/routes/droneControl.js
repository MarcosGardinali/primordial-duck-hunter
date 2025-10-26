const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../config/prisma');
const { HIBERNATION_STATUS } = require('../utils/enums');

const router = express.Router();

// Sistema de controle do drone de captura
class CaptureSystem {
  constructor() {
    this.isActive = false;
    this.currentTarget = null;
    this.position = { lat: -23.5505, lng: -46.6333 }; // Base DSIN
  }
  
  async getStatusFromDB() {
    try {
      const status = await prisma.droneStatus.findFirst({
        orderBy: { id: 'desc' }
      });
      
      if (status) {
        return {
          battery: Math.max(0, Math.min(100, status.battery)),
          fuel: Math.max(0, Math.min(100, status.fuel)),
          integrity: Math.max(0, Math.min(100, status.integrity))
        };
      }
      
      // Se não existe, criar status inicial
      const newStatus = await prisma.droneStatus.create({
        data: { battery: 100, fuel: 100, integrity: 100 }
      });
      
      return {
        battery: newStatus.battery,
        fuel: newStatus.fuel,
        integrity: newStatus.integrity
      };
    } catch (error) {
      console.error('Erro ao buscar status do drone:', error);
      return { battery: 100, fuel: 100, integrity: 100 };
    }
  }
  
  async updateStatusInDB(battery, fuel, integrity) {
    try {
      const latestStatus = await prisma.droneStatus.findFirst({
        orderBy: { id: 'desc' }
      });
      
      if (latestStatus) {
        await prisma.droneStatus.update({
          where: { id: latestStatus.id },
          data: { 
            battery: Math.max(0, Math.min(100, Math.round(battery))), 
            fuel: Math.max(0, Math.min(100, Math.round(fuel))), 
            integrity: Math.max(0, Math.min(100, Math.round(integrity)))
          }
        });
      } else {
        // Se não existe status, criar um novo
        await prisma.droneStatus.create({
          data: {
            battery: Math.max(0, Math.min(100, Math.round(battery))),
            fuel: Math.max(0, Math.min(100, Math.round(fuel))),
            integrity: Math.max(0, Math.min(100, Math.round(integrity)))
          }
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status do drone:', error);
    }
  }

  // Identificar pontos fracos
  identifyWeaknesses(duck) {
    const weaknesses = [];
    
    if (duck.height > 200) {
      weaknesses.push({
        type: 'Tamanho',
        description: 'Alvo grande - atacar por cima com objetos pesados',
        strategy: 'aerial_drop'
      });
    }
    
    if (duck.hibernation_status === HIBERNATION_STATUS.HIBERNACAO_PROFUNDA) {
      weaknesses.push({
        type: 'Estado',
        description: 'Vulnerável durante hibernação - aproximação silenciosa',
        strategy: 'stealth_approach'
      });
    }
    
    if (duck.hibernation_status === HIBERNATION_STATUS.EM_TRANSE && duck.heart_rate_bpm > 85) {
      weaknesses.push({
        type: 'Instabilidade',
        description: 'Batimentos elevados - pode ser distraído com ruídos',
        strategy: 'sound_distraction'
      });
    }
    
    if (duck.mutations_count < 3) {
      weaknesses.push({
        type: 'Mutações Baixas',
        description: 'Poucas adaptações - táticas convencionais eficazes',
        strategy: 'conventional_attack'
      });
    }
    
    if (duck.weight < 2000) {
      weaknesses.push({
        type: 'Peso Leve',
        description: 'Pode ser imobilizado com redes de contenção',
        strategy: 'net_capture'
      });
    }

    return weaknesses;
  }

  // Calcular estratégias de ataque
  calculateAttackStrategies(duck, weaknesses) {
    const strategies = [];
    
    weaknesses.forEach(weakness => {
      switch (weakness.strategy) {
        case 'aerial_drop':
          strategies.push({
            name: 'Bombardeio Aéreo',
            description: 'Soltar pedras de 50kg de altura de 100m',
            success_rate: 75,
            energy_cost: 30,
            risk_level: 'Médio'
          });
          break;
          
        case 'stealth_approach':
          strategies.push({
            name: 'Aproximação Furtiva',
            description: 'Usar modo silencioso e dardos tranquilizantes',
            success_rate: 90,
            energy_cost: 15,
            risk_level: 'Baixo'
          });
          break;
          
        case 'sound_distraction':
          strategies.push({
            name: 'Distração Sonora',
            description: 'Emitir frequências específicas para desorientar',
            success_rate: 60,
            energy_cost: 20,
            risk_level: 'Médio'
          });
          break;
          
        case 'conventional_attack':
          strategies.push({
            name: 'Ataque Convencional',
            description: 'Uso de armamento padrão e táticas militares',
            success_rate: 70,
            energy_cost: 40,
            risk_level: 'Alto'
          });
          break;
          
        case 'net_capture':
          strategies.push({
            name: 'Captura com Rede',
            description: 'Lançar rede de contenção reforçada',
            success_rate: 85,
            energy_cost: 25,
            risk_level: 'Baixo'
          });
          break;
      }
    });

    // Estratégia especial baseada no superpoder
    if (duck.superpower_name) {
      const counterStrategy = this.generateCounterStrategy(duck.superpower_name, duck.superpower_classification);
      if (counterStrategy) {
        strategies.push(counterStrategy);
      }
    }

    return strategies.sort((a, b) => b.success_rate - a.success_rate);
  }

  // Sistema Gerador de Defesas Aleatórias
  generateCounterStrategy(superpowerName, classification) {
    const randomDefenses = [
      {
        condition: 'elemental',
        defense: {
          name: 'Escudo Térmico Adaptativo',
          description: 'Ativar proteção contra elementos naturais',
          success_rate: 65,
          energy_cost: 35,
          risk_level: 'Médio'
        }
      },
      {
        condition: 'bélico',
        defense: {
          name: 'Teleporte de Emergência',
          description: 'Teletransportar crianças de festas infantis para atirar brigadeiros',
          success_rate: 45,
          energy_cost: 50,
          risk_level: 'Alto'
        }
      },
      {
        condition: 'psíquico',
        defense: {
          name: 'Interferência Mental',
          description: 'Transmitir música de elevador em loop para confundir',
          success_rate: 55,
          energy_cost: 30,
          risk_level: 'Médio'
        }
      },
      {
        condition: 'laser',
        defense: {
          name: 'Espelhos Refletores',
          description: 'Desdobrar espelhos para refletir ataques de laser',
          success_rate: 80,
          energy_cost: 20,
          risk_level: 'Baixo'
        }
      },
      {
        condition: 'temporal',
        defense: {
          name: 'Âncora Temporal',
          description: 'Fixar-se no tempo presente usando cristais de quartzo',
          success_rate: 40,
          energy_cost: 60,
          risk_level: 'Muito Alto'
        }
      }
    ];

    // Buscar defesa apropriada
    let selectedDefense = randomDefenses.find(def => 
      classification.toLowerCase().includes(def.condition)
    );

    // Se não encontrar, usar defesa aleatória
    if (!selectedDefense) {
      selectedDefense = randomDefenses[Math.floor(Math.random() * randomDefenses.length)];
    }

    return selectedDefense.defense;
  }

  // Simular voo até o alvo
  async flyToTarget(targetLat, targetLng) {
    const status = await this.getStatusFromDB();
    
    const distance = Math.sqrt(
      Math.pow(targetLat - this.position.lat, 2) + 
      Math.pow(targetLng - this.position.lng, 2)
    ) * 111; // km

    const fuelCost = Math.min(distance * 2, 50);
    const batteryCost = Math.min(distance * 1.5, 30);

    const newFuel = Math.max(0, status.fuel - fuelCost);
    const newBattery = Math.max(0, status.battery - batteryCost);
    
    console.log(`Voo: Bateria antes: ${status.battery}%, depois: ${newBattery}%, consumo: ${batteryCost}%`);
    
    await this.updateStatusInDB(newBattery, newFuel, status.integrity);
    this.position = { lat: targetLat, lng: targetLng };

    return {
      distance: Math.round(distance),
      fuel_consumed: Math.round(fuelCost),
      battery_consumed: Math.round(batteryCost),
      flight_time: Math.round(distance * 2) // minutos
    };
  }

  // Calcular chance de captura baseada no status, mutações e estratégia
  calculateCaptureChance(duck, strategyIndex) {
    let baseChance = 0;
    
    // Chance base por status de hibernação
    switch (duck.hibernation_status) {
      case HIBERNATION_STATUS.HIBERNACAO_PROFUNDA:
        baseChance = 85;
        break;
      case HIBERNATION_STATUS.EM_TRANSE:
        baseChance = 65;
        break;
      case HIBERNATION_STATUS.DESPERTO:
        baseChance = 45;
        break;
      default:
        baseChance = 45;
    }
    
    // Redução por mutações (apenas se desperto)
    if (duck.hibernation_status === HIBERNATION_STATUS.DESPERTO && duck.mutations_count > 0) {
      const mutationPenalty = Math.min(duck.mutations_count, 7) * 5;
      baseChance -= mutationPenalty;
    }
    
    // Modificador por tipo de estratégia
    const strategyModifiers = {
      0: { // Ataque Furtivo
        hibernacao_profunda: 10, // Muito eficaz contra hibernação
        em_transe: 5,
        desperto: -5 // Menos eficaz contra despertos
      },
      1: { // Bombardeio Aéreo
        hibernacao_profunda: -10, // Pode acordar o pato
        em_transe: 0,
        desperto: 10 // Eficaz contra despertos
      },
      2: { // Captura com Rede
        hibernacao_profunda: 5,
        em_transe: 10, // Muito eficaz contra transe
        desperto: 0
      },
      3: { // Distração Sonora
        hibernacao_profunda: -15, // Ineficaz contra hibernação
        em_transe: 15, // Muito eficaz contra transe
        desperto: 5
      },
      4: { // Ataque Elétrico
        hibernacao_profunda: 0,
        em_transe: -5,
        desperto: 15 // Muito eficaz contra despertos
      }
    };
    
    if (strategyIndex !== undefined && strategyModifiers[strategyIndex]) {
      const modifier = strategyModifiers[strategyIndex][duck.hibernation_status] || 0;
      baseChance += modifier;
    }
    
    // Chance mínima de 10%
    return Math.max(baseChance, 10);
  }

  // Executar missão de captura
  async executeMission(strategy, duck, strategyIndex) {
    const status = await this.getStatusFromDB();
    const energyCost = strategy.energy_cost;
    
    // Calcular chance de captura baseada no pato e estratégia (mesma lógica da análise)
    const captureChance = this.calculateCaptureChance(duck, strategyIndex);
    const success = Math.random() * 100 < captureChance;
    
    const newBattery = Math.max(0, status.battery - energyCost);
    let newIntegrity = status.integrity;
    let damageTaken = 0;
    
    if (!success) {
      damageTaken = Math.random() * 20;
      newIntegrity = Math.max(0, status.integrity - damageTaken);
    }
    
    console.log(`Missão: Bateria antes: ${status.battery}%, depois: ${newBattery}%, consumo: ${energyCost}%`);
    
    await this.updateStatusInDB(newBattery, status.fuel, newIntegrity);

    return {
      success: success,
      capture_chance: captureChance,
      energy_consumed: energyCost,
      damage_taken: Math.round(damageTaken),
      result_message: success ? 
        `✅ Missão bem-sucedida! ${strategy.name} executada com êxito.)` :
        `❌ Missão falhou. ${strategy.name} não foi eficaz contra o alvo.)`
    };
  }

  // Status do drone
  async getStatus() {
    const status = await this.getStatusFromDB();
    const result = {
      battery: status.battery,
      fuel: status.fuel,
      integrity: status.integrity,
      position: this.position,
      is_active: this.isActive,
      operational: status.battery > 10 && status.fuel > 10 && status.integrity > 20
    };
    
    console.log('Status do drone:', result);
    return result;
  }

  // Recarregar sistemas
  async recharge() {
    const status = await this.getStatusFromDB();
    const newIntegrity = Math.min(100, status.integrity + 50);
    await this.updateStatusInDB(100, 100, newIntegrity);
    this.position = { lat: -23.5505, lng: -46.6333 }; // Voltar à base
  }
}

const captureSystem = new CaptureSystem();

// Análise de alvo específico
router.get('/analyze/:id', auth, async (req, res, next) => {
  try {
    const duck = await prisma.primordialDuck.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { superpower: true }
    });

    if (!duck) {
      return res.status(404).json({ error: 'Pato Primordial não encontrado' });
    }

    // Converter para formato compatível
    const duckData = {
      ...duck,
      hibernation_status: duck.hibernationStatus,
      heart_rate_bpm: duck.heartRateBpm,
      mutations_count: duck.mutationsCount,
      superpower_name: duck.superpower?.name,
      superpower_description: duck.superpower?.description,
      superpower_classification: duck.superpower?.classification,
      height: parseFloat(duck.height),
      weight: parseFloat(duck.weight),
      latitude: parseFloat(duck.latitude),
      longitude: parseFloat(duck.longitude),
      gps_precision: parseFloat(duck.gpsPrecision),
      reference_point: duck.referencePoint
    };

    const weaknesses = captureSystem.identifyWeaknesses(duckData);
    const strategies = captureSystem.calculateAttackStrategies(duckData, weaknesses);
    
    // Calcular chances para cada estratégia
    const strategyChances = [
      captureSystem.calculateCaptureChance(duckData, 0), // Furtivo
      captureSystem.calculateCaptureChance(duckData, 1), // Bombardeio
      captureSystem.calculateCaptureChance(duckData, 2), // Rede
      captureSystem.calculateCaptureChance(duckData, 3), // Sonora
      captureSystem.calculateCaptureChance(duckData, 4)  // Elétrico
    ];

    res.json({
      target: duckData,
      weaknesses: weaknesses,
      strategies: strategies,
      strategy_chances: strategyChances,
      drone_status: await captureSystem.getStatus()
    });
  } catch (error) {
    next(error);
  }
});

// Iniciar missão de captura
router.post('/mission/:id', auth, async (req, res, next) => {
  try {
    const { strategy_index } = req.body;
    
    const duck = await prisma.primordialDuck.findUnique({
      where: { 
        id: parseInt(req.params.id),
        captured: false
      },
      include: { superpower: true }
    });

    if (!duck) {
      return res.status(404).json({ error: 'Pato Primordial não encontrado ou já capturado' });
    }

    // Converter para formato compatível
    const duckData = {
      ...duck,
      hibernation_status: duck.hibernationStatus,
      superpower_name: duck.superpower?.name,
      superpower_classification: duck.superpower?.classification,
      heart_rate_bpm: duck.heartRateBpm,
      mutations_count: duck.mutationsCount,
      height: parseFloat(duck.height),
      weight: parseFloat(duck.weight)
    };

    const strategies = [
      { name: 'Ataque Furtivo', energy_cost: 25, success_rate: 85 },
      { name: 'Bombardeio Aéreo', energy_cost: 45, success_rate: 65 },
      { name: 'Captura com Rede', energy_cost: 35, success_rate: 75 },
      { name: 'Distração Sonora', energy_cost: 20, success_rate: 55 },
      { name: 'Ataque Elétrico', energy_cost: 40, success_rate: 70 }
    ];
    
    if (!strategies[strategy_index]) {
      return res.status(400).json({ error: 'Estratégia inválida' });
    }

    // Voar até o alvo
    const flightData = await captureSystem.flyToTarget(parseFloat(duck.latitude), parseFloat(duck.longitude));
    
    // Executar missão
    const missionResult = await captureSystem.executeMission(strategies[strategy_index], duckData, strategy_index);

    // Se capturou com sucesso, marcar como capturado
    if (missionResult.success) {
      await prisma.primordialDuck.update({
        where: { id: parseInt(req.params.id) },
        data: {
          captured: true,
          captureStrategy: strategies[strategy_index].name,
          captureDate: new Date()
        }
      });
    }

    const finalStatus = await captureSystem.getStatus();
    
    res.json({
      flight: flightData,
      mission: missionResult,
      strategy_used: strategies[strategy_index],
      drone_status: finalStatus
    });
  } catch (error) {
    next(error);
  }
});

// Listar patos capturados
router.get('/captured', auth, async (req, res, next) => {
  try {
    const capturedDucks = await prisma.primordialDuck.findMany({
      where: { captured: true },
      include: { superpower: true },
      orderBy: { captureDate: 'desc' }
    });
    
    const result = capturedDucks.map(duck => ({
      id: duck.id,
      nickname: duck.nickname,
      photo_url: duck.photoUrl,
      hibernation_status: duck.hibernationStatus,
      mutations_count: duck.mutationsCount,
      capture_strategy: duck.captureStrategy,
      capture_date: duck.captureDate,
      superpower_name: duck.superpower?.name,
      height: duck.height,
      weight: duck.weight,
      city: duck.city,
      country: duck.country
    }));
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Status do drone
router.get('/status', auth, async (req, res, next) => {
  try {
    const status = await captureSystem.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

// Recarregar drone
router.post('/recharge', auth, async (req, res, next) => {
  try {
    await captureSystem.recharge();
    const status = await captureSystem.getStatus();
    res.json({
      message: 'Drone recarregado com sucesso',
      status: status
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;