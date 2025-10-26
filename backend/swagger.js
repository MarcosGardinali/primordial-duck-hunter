const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Primordial Duck Hunter API',
      version: '2.0.0',
      description: 'API completa para caça e catalogação de Patos Primordiais com sistema militar',
    },
    servers: [
      {
        url: 'http://localhost:8765/api',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            bloodType: { type: 'string', nullable: true },
            height: { type: 'number', nullable: true },
            weight: { type: 'number', nullable: true },
            rank: { type: 'string', nullable: true },
            birthDate: { type: 'string', format: 'date', nullable: true },
            cpf: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            emergencyContact: { type: 'string', nullable: true },
            specialization: { type: 'string', nullable: true },
            emailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password', 'rank'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            bloodType: { type: 'string', nullable: true },
            height: { type: 'number', nullable: true },
            weight: { type: 'number', nullable: true },
            rank: { type: 'string' },
            birthDate: { type: 'string', format: 'date', nullable: true },
            cpf: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            emergencyContact: { type: 'string', nullable: true },
            specialization: { type: 'string', nullable: true },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        Drone: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            serialNumber: { type: 'string' },
            brand: { type: 'string' },
            manufacturer: { type: 'string' },
            countryOrigin: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Superpower: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            classification: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PrimordialDuck: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nickname: { type: 'string', nullable: true },
            photoUrl: { type: 'string', nullable: true },
            droneId: { type: 'integer' },
            height: { type: 'number' },
            weight: { type: 'number' },
            heightUnit: { type: 'string' },
            weightUnit: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            gpsPrecision: { type: 'number' },
            precisionUnit: { type: 'string' },
            referencePoint: { type: 'string', nullable: true },
            hibernationStatus: { type: 'string', enum: ['desperto', 'em_transe', 'hibernacao_profunda'] },
            heartRateBpm: { type: 'integer', nullable: true },
            mutationsCount: { type: 'integer' },
            superpowerId: { type: 'integer', nullable: true },
            captured: { type: 'boolean' },
            captureStrategy: { type: 'string', nullable: true },
            captureDate: { type: 'string', format: 'date-time', nullable: true },
            discoveredAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CaptureAnalysis: {
          type: 'object',
          properties: {
            operational_cost: { type: 'integer' },
            military_power: { type: 'integer' },
            risk_level: { type: 'integer' },
            knowledge_gain: { type: 'integer' },
            distance_km: { type: 'integer' },
            classifications: {
              type: 'object',
              properties: {
                operational_cost: { type: 'string' },
                military_power: { type: 'string' },
                risk_level: { type: 'string' },
                knowledge_gain: { type: 'string' },
              },
            },
            priority: { type: 'string' },
            recommendations: { type: 'array', items: { type: 'string' } },
          },
        },
        DroneStatus: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            battery: { type: 'integer' },
            fuel: { type: 'integer' },
            integrity: { type: 'integer' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  param: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Cadastro militar de usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'Usuário cadastrado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            400: { description: 'Dados inválidos' },
            409: { description: 'Email ou CPF já cadastrado' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Login do usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      token: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Credenciais inválidas' },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Usuários'],
          summary: 'Listar todos os usuários',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de usuários',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Usuários'],
          summary: 'Criar novo usuário',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterInput' },
              },
            },
          },
          responses: {
            201: { description: 'Usuário criado com sucesso' },
            400: { description: 'Dados inválidos' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Usuários'],
          summary: 'Buscar usuário por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Usuário encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            404: { description: 'Usuário não encontrado' },
          },
        },
        put: {
          tags: ['Usuários'],
          summary: 'Atualizar usuário',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Usuário atualizado' },
            404: { description: 'Usuário não encontrado' },
          },
        },
        delete: {
          tags: ['Usuários'],
          summary: 'Deletar usuário',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Usuário deletado' },
            404: { description: 'Usuário não encontrado' },
          },
        },
      },
      '/drones': {
        get: {
          tags: ['Drones'],
          summary: 'Listar todos os drones',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de drones',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Drone' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Drones'],
          summary: 'Criar novo drone',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Drone criado com sucesso' },
          },
        },
      },
      '/drones/{id}': {
        get: {
          tags: ['Drones'],
          summary: 'Buscar drone por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Drone encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Drone' },
                },
              },
            },
          },
        },
        put: {
          tags: ['Drones'],
          summary: 'Atualizar drone',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Drone atualizado' },
          },
        },
        delete: {
          tags: ['Drones'],
          summary: 'Deletar drone',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Drone deletado' },
          },
        },
      },
      '/superpowers': {
        get: {
          tags: ['Superpoderes'],
          summary: 'Listar todos os superpoderes',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de superpoderes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Superpower' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Superpoderes'],
          summary: 'Criar novo superpoder',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Superpoder criado com sucesso' },
          },
        },
      },
      '/superpowers/{id}': {
        get: {
          tags: ['Superpoderes'],
          summary: 'Buscar superpoder por ID',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Superpoder encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Superpower' },
                },
              },
            },
          },
        },
        put: {
          tags: ['Superpoderes'],
          summary: 'Atualizar superpoder',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Superpoder atualizado' },
          },
        },
        delete: {
          tags: ['Superpoderes'],
          summary: 'Deletar superpoder',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Superpoder deletado' },
          },
        },
      },
      '/primordial-ducks': {
        get: {
          tags: ['Patos Primordiais'],
          summary: 'Listar todos os Patos Primordiais',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de Patos Primordiais',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/PrimordialDuck' },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Patos Primordiais'],
          summary: 'Catalogar novo Pato Primordial',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Pato Primordial catalogado com sucesso' },
          },
        },
      },
      '/primordial-ducks/{id}': {
        get: {
          tags: ['Patos Primordiais'],
          summary: 'Buscar Pato Primordial por ID',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Pato Primordial encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PrimordialDuck' },
                },
              },
            },
          },
        },
        put: {
          tags: ['Patos Primordiais'],
          summary: 'Atualizar Pato Primordial',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Pato Primordial atualizado' },
          },
        },
        delete: {
          tags: ['Patos Primordiais'],
          summary: 'Deletar Pato Primordial',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Pato Primordial deletado' },
          },
        },
      },
      '/primordial-ducks/stats/overview': {
        get: {
          tags: ['Patos Primordiais'],
          summary: 'Estatísticas gerais dos Patos Primordiais',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Estatísticas dos Patos Primordiais' },
          },
        },
      },
      '/capture-analysis/overview': {
        get: {
          tags: ['Análise de Captura'],
          summary: 'Análise completa de todos os patos',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Análise completa de captura',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      analyses: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            nickname: { type: 'string' },
                            analysis: { $ref: '#/components/schemas/CaptureAnalysis' },
                          },
                        },
                      },
                      statistics: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/capture-analysis/ranking': {
        get: {
          tags: ['Análise de Captura'],
          summary: 'Ranking por prioridade de captura',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Ranking de prioridade de captura',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        nickname: { type: 'string' },
                        analysis: { $ref: '#/components/schemas/CaptureAnalysis' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/capture-analysis/duck/{id}': {
        get: {
          tags: ['Análise de Captura'],
          summary: 'Análise individual de um pato',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Análise individual do pato',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      duck: { $ref: '#/components/schemas/PrimordialDuck' },
                      analysis: { $ref: '#/components/schemas/CaptureAnalysis' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/drone-control/status': {
        get: {
          tags: ['Controle do Drone'],
          summary: 'Status atual do drone',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Status do drone',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/DroneStatus' },
                },
              },
            },
          },
        },
      },
      '/drone-control/analyze/{id}': {
        get: {
          tags: ['Controle do Drone'],
          summary: 'Analisar alvo específico',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Análise do alvo' },
          },
        },
      },
      '/drone-control/mission/{id}': {
        post: {
          tags: ['Controle do Drone'],
          summary: 'Executar missão de captura',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: { description: 'Missão executada' },
          },
        },
      },
      '/drone-control/recharge': {
        post: {
          tags: ['Controle do Drone'],
          summary: 'Recarregar drone',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Drone recarregado' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);