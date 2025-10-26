const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../config/prisma');
const { HIBERNATION_STATUS } = require('../utils/enums');

const router = express.Router();

// Algoritmo de análise de captura
const analyzeCaptureMetrics = (duck) => {
  const DSIN_LAT = -22.233613471585674; // DSIN (base de operações)
  const DSIN_LNG = -49.93410614450074;

  // Calcular distância da base (fórmula de Haversine simplificada)
  const distance = Math.sqrt(
    Math.pow((duck.latitude || 0) - DSIN_LAT, 2) + 
    Math.pow((duck.longitude || 0) - DSIN_LNG, 2)
  ) * 111; // Aproximação em km

  // Custo Operacional (0-100)
  let operationalCost = 0;
  operationalCost += Math.min((duck.height || 0) / 10, 30); // Altura
  operationalCost += Math.min((duck.weight || 0) / 100, 25); // Peso
  operationalCost += Math.min(distance / 100, 35); // Distância
  operationalCost += (duck.gps_precision || 0) > 100 ? 10 : 0; // Precisão baixa

  // Poderio Militar Necessário (0-100)
  let militaryPower = 0;
  if (duck.hibernation_status === HIBERNATION_STATUS.DESPERTO) {
    militaryPower += 60;
    militaryPower += (duck.mutations_count || 0) * 3;
  } else if (duck.hibernation_status === HIBERNATION_STATUS.EM_TRANSE) {
    militaryPower += 30;
    militaryPower += (duck.heart_rate_bpm || 0) > 80 ? 20 : 10;
  } else {
    militaryPower += 5;
  }

  // Grau de Risco (0-100)
  let riskLevel = 0;
  if (duck.hibernation_status === HIBERNATION_STATUS.DESPERTO) {
    riskLevel += 70;
    riskLevel += (duck.mutations_count || 0) * 2;
  } else if (duck.hibernation_status === HIBERNATION_STATUS.EM_TRANSE) {
    riskLevel += (duck.heart_rate_bpm || 0) > 90 ? 40 : 20;
  } else {
    riskLevel += 5;
  }

  // Ganho em Conhecimento (0-100)
  let knowledgeGain = 0;
  knowledgeGain += (duck.mutations_count || 0) * 8;
  knowledgeGain += duck.hibernation_status === HIBERNATION_STATUS.DESPERTO ? 30 : 0;
  knowledgeGain += duck.superpower_name ? 25 : 0;
  knowledgeGain += duck.reference_point ? 15 : 0;

  // Classificações
  const getClassification = (value) => {
    if (value <= 20) return 'Muito Baixo';
    if (value <= 40) return 'Baixo';
    if (value <= 60) return 'Moderado';
    if (value <= 80) return 'Alto';
    return 'Muito Alto';
  };

  const getPriority = () => {
    const score = (knowledgeGain * 2) - operationalCost - (riskLevel * 0.5);
    if (score >= 60) return 'Prioridade Máxima';
    if (score >= 30) return 'Alta Prioridade';
    if (score >= 0) return 'Prioridade Média';
    if (score >= -30) return 'Baixa Prioridade';
    return 'Não Recomendado';
  };

  const generateRecommendations = () => {
    const recommendations = [];

    if (duck.hibernation_status === HIBERNATION_STATUS.HIBERNACAO_PROFUNDA) {
      recommendations.push('✅ Ideal para captura: baixo risco e custo reduzido');
    }

    if (duck.hibernation_status === HIBERNATION_STATUS.EM_TRANSE && duck.heart_rate_bpm > 85) {
      recommendations.push('⚠️ Risco de despertar: aproximação cautelosa necessária');
    }

    if (duck.hibernation_status === HIBERNATION_STATUS.DESPERTO) {
      recommendations.push('🚨 Alto risco: equipe militar especializada obrigatória');
    }

    if (duck.mutations_count >= 7) {
      recommendations.push('🧬 Alto valor científico: priorizar captura para pesquisa');
    }

    if (duck.height > 250) {
      recommendations.push('🚁 Transporte especial: helicóptero de carga necessário');
    }

    if (duck.weight > 4000) {
      recommendations.push('⚖️ Equipamento pesado: guindastes para movimentação');
    }

    if (operationalCost > 70) {
      recommendations.push('💰 Custo elevado: avaliar viabilidade orçamentária');
    }

    if (knowledgeGain < 30) {
      recommendations.push('📊 Baixo valor científico: considerar outras prioridades');
    }

    return recommendations;
  };

  return {
    operational_cost: Math.min(Math.round(operationalCost), 100),
    military_power: Math.min(Math.round(militaryPower), 100),
    risk_level: Math.min(Math.round(riskLevel), 100),
    knowledge_gain: Math.min(Math.round(knowledgeGain), 100),
    distance_km: Math.round(distance),
    classifications: {
      operational_cost: getClassification(operationalCost),
      military_power: getClassification(militaryPower),
      risk_level: getClassification(riskLevel),
      knowledge_gain: getClassification(knowledgeGain)
    },
    priority: getPriority(),
    recommendations: generateRecommendations()
  };
};

// Análise individual
router.get('/duck/:id', auth, async (req, res, next) => {
  try {
    const duck = await prisma.primordialDuck.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        drone: true,
        superpower: true
      }
    });

    if (!duck) {
      return res.status(404).json({ error: 'Pato Primordial não encontrado' });
    }

    // Converter para formato compatível
    const duckData = {
      ...duck,
      serial_number: duck.drone?.serialNumber,
      brand: duck.drone?.brand,
      manufacturer: duck.drone?.manufacturer,
      country_origin: duck.drone?.countryOrigin,
      superpower_name: duck.superpower?.name,
      superpower_description: duck.superpower?.description,
      superpower_classification: duck.superpower?.classification,
      hibernation_status: duck.hibernationStatus,
      heart_rate_bpm: duck.heartRateBpm,
      mutations_count: duck.mutationsCount,
      gps_precision: duck.gpsPrecision,
      reference_point: duck.referencePoint,
      country_code: duck.countryCode,
      height: parseFloat(duck.height),
      weight: parseFloat(duck.weight),
      latitude: parseFloat(duck.latitude),
      longitude: parseFloat(duck.longitude)
    };

    const analysis = analyzeCaptureMetrics(duckData);

    res.json({
      duck: duckData,
      analysis: analysis
    });
  } catch (error) {
    next(error);
  }
});

// Análise completa de todos os patos
router.get('/overview', auth, async (req, res, next) => {
  try {
    const ducks = await prisma.primordialDuck.findMany({
      include: {
        drone: true,
        superpower: true
      },
      orderBy: { discoveredAt: 'desc' }
    });

    const analyses = ducks.map(duck => {
      const duckData = {
        ...duck,
        hibernation_status: duck.hibernationStatus,
        heart_rate_bpm: duck.heartRateBpm,
        mutations_count: duck.mutationsCount,
        gps_precision: duck.gpsPrecision,
        reference_point: duck.referencePoint,
        superpower_name: duck.superpower?.name,
        height: parseFloat(duck.height),
        weight: parseFloat(duck.weight),
        latitude: parseFloat(duck.latitude),
        longitude: parseFloat(duck.longitude)
      };
      
      return {
        id: duck.id,
        nickname: duck.nickname,
        city: duck.city,
        country: duck.country,
        country_code: duck.countryCode,
        hibernation_status: duck.hibernationStatus,
        mutations_count: duck.mutationsCount,
        superpower_name: duck.superpower?.name,
        analysis: analyzeCaptureMetrics(duckData)
      };
    });

    // Estatísticas gerais
    const avgCost = analyses.length > 0 ? analyses.reduce((sum, a) => sum + (a.analysis.operational_cost || 0), 0) / analyses.length : 0;
    const avgRisk = analyses.length > 0 ? analyses.reduce((sum, a) => sum + (a.analysis.risk_level || 0), 0) / analyses.length : 0;
    const avgKnowledge = analyses.length > 0 ? analyses.reduce((sum, a) => sum + (a.analysis.knowledge_gain || 0), 0) / analyses.length : 0;

    const stats = {
      total_ducks: analyses.length,
      avg_operational_cost: Math.round(avgCost),
      avg_risk_level: Math.round(avgRisk),
      avg_knowledge_gain: Math.round(avgKnowledge),
      priority_distribution: analyses.reduce((acc, a) => {
        acc[a.analysis.priority] = (acc[a.analysis.priority] || 0) + 1;
        return acc;
      }, {}),
      top_targets: analyses
        .sort((a, b) => {
          const scoreA = (a.analysis.knowledge_gain * 2) - a.analysis.operational_cost - (a.analysis.risk_level * 0.5);
          const scoreB = (b.analysis.knowledge_gain * 2) - b.analysis.operational_cost - (b.analysis.risk_level * 0.5);
          return scoreB - scoreA;
        })
        .slice(0, 5)
    };

    res.json({
      analyses: analyses,
      statistics: stats
    });
  } catch (error) {
    next(error);
  }
});

// Ranking por prioridade
router.get('/ranking', auth, async (req, res, next) => {
  try {
    const ducks = await prisma.primordialDuck.findMany({
      include: {
        drone: true,
        superpower: true
      },
      orderBy: { discoveredAt: 'desc' }
    });

    const ranking = ducks
      .map(duck => {
        const duckData = {
          ...duck,
          hibernation_status: duck.hibernationStatus,
          heart_rate_bpm: duck.heartRateBpm,
          mutations_count: duck.mutationsCount,
          gps_precision: duck.gpsPrecision,
          reference_point: duck.referencePoint,
          superpower_name: duck.superpower?.name,
          height: parseFloat(duck.height),
          weight: parseFloat(duck.weight),
          latitude: parseFloat(duck.latitude),
          longitude: parseFloat(duck.longitude)
        };
        
        return {
          id: duck.id,
          nickname: duck.nickname,
          city: duck.city,
          country: duck.country,
          country_code: duck.countryCode,
          hibernation_status: duck.hibernationStatus,
          mutations_count: duck.mutationsCount,
          superpower_name: duck.superpower?.name,
          height: parseFloat(duck.height),
          weight: parseFloat(duck.weight),
          analysis: analyzeCaptureMetrics(duckData)
        };
      })
      .sort((a, b) => {
        const scoreA = (a.analysis.knowledge_gain * 2) - a.analysis.operational_cost - (a.analysis.risk_level * 0.5);
        const scoreB = (b.analysis.knowledge_gain * 2) - b.analysis.operational_cost - (b.analysis.risk_level * 0.5);
        return scoreB - scoreA;
      });

    res.json(ranking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;