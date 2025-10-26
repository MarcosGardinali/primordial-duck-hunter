# Coder Challenge 2025 - Operação Patos Primordiais 🦆

Um sistema completo para monitoramento, análise e captura de Patos Primordiais utilizando tecnologia de drones avançada.

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- Prisma (ORM)
- Jest (Testes)
- Swagger (Documentação API)

### Frontend
- Vue.js 3
- Vite
- SCSS
- Pinia (Gerenciamento de Estado)
- Leaflet (Mapas)
- Chart.js (Gráficos)

### Infraestrutura
- Docker
- Docker Compose
- Nginx

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Git para clonar o repositório

## 🔧 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/MarcosGardinali/Coder-Challenge-2025.git
cd Coder-Challenge-2025
```

2. Inicie os containers com Docker Compose:
```bash
docker-compose up -d
```

O sistema estará disponível em:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8765
- Swagger Documentation: http://localhost:8765/api-docs
- PHPMyAdmin: http://localhost:7654
- Banco de dados MySQL: porta 9876

## 🎯 Funcionalidades do Sistema

### 1. Catalogação de Patos Primordiais 📊

- **Gestão de Drones**
  - Registro e monitoramento de drones
  - Informações detalhadas: número de série, marca, fabricante, país de origem
  - Sistema de conversão automática de unidades (imperial/métrico)

- **Registro de Patos**
  - Medições precisas de altura e peso
  - Conversão automática entre sistemas métrico e imperial
  - Localização geográfica com:
    - Cidade e país
    - Coordenadas GPS (latitude/longitude)
    - Precisão das coordenadas
    - Identificação de pontos de referência

- **Monitoramento de Estado**
  - Status de hibernação (desperto, em transe, hibernação profunda)
  - Monitoramento de batimentos cardíacos
  - Registro de mutações
  - Catalogação de superpoderes

### 2. Análise de Captura 📈

- **Sistema de Classificação**
  - Cálculo de custo operacional
  - Avaliação de riscos
  - Análise de viabilidade

- **Métricas de Avaliação**
  - Custo de transporte baseado em tamanho/peso
  - Risco baseado no estado de hibernação
  - Valor científico baseado em mutações
  - Poderio militar necessário
  - Distância da base de operações

### 3. Sistema de Controle de Drones de Captura 🎮

- **Controle de Voo**
  - Interface de controle em tempo real
  - Monitoramento de:
    - Nível de bateria
    - Combustível
    - Integridade física

- **Sistema Tático**
  - Identificação de pontos fracos
  - Cálculo de estratégias de ataque
  - Sistema Gerador de Defesas Aleatórias
  - Contramedidas para superpoderes

## 🎲 Banco de Dados

O sistema utiliza Prisma como ORM com migrations automáticas. O banco de dados é inicializado automaticamente com o Docker Compose.

## 🧪 Testes

O projeto inclui testes unitários e de integração. Para executar os testes:

```bash
# No container do backend
docker exec -it coder-challenge-2025-backend npm test
```

## 📚 Documentação

A documentação completa da API está disponível através do Swagger em http://localhost:8765/api-docs

## 🔐 Segurança

O sistema implementa:
- Autenticação JWT
- Validação de dados
- Middleware de autorização
- Tratamento de erros

## 🌐 Escalabilidade

A arquitetura do projeto foi desenvolvida pensando em escalabilidade:
- Frontend e Backend separados
- Containers Docker independentes
- Nginx como proxy reverso
- ORM com suporte a diferentes bancos de dados