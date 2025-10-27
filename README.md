# 🦆 Primordial Duck Hunter
### *"Hunt. Analyze. Capture. The future of duck intelligence begins here."*

Um sistema completo para **monitoramento, análise e captura de Patos Primordiais**, integrando telemetria de drones, classificação de risco e controle tático em tempo real.  
Desenvolvido para o **Coder Challenge 2025**, o projeto combina **engenharia de dados, análise inteligente e interface interativa** para a Operação Patos Primordiais.

---

## 🧠 Badges

[![Made with Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vue.js&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)]()
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)]()
[![Prisma ORM](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)]()
[![Swagger Docs](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)]()
[![License MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)]()

---

## 📚 Sumário
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📋 Pré-requisitos](#-pré-requisitos)
- [🔧 Instalação e Execução](#-instalação-e-execução)
- [🎯 Funcionalidades do Sistema](#-funcionalidades-do-sistema)
- [🎲 Banco de Dados](#-banco-de-dados)
- [🧪 Testes](#-testes)
- [📚 Documentação da API](#-documentação)
- [🔐 Segurança](#-segurança)
- [🌐 Escalabilidade e Arquitetura](#-escalabilidade)
- [👨‍💻 Autor](#-autor)

---

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
git clone https://github.com/MarcosGardinali/primordial-duck-hunter.git
cd primordial-duck-hunter
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

---

## 👨‍💻 Autor

**Marcos Gardinali**  
Desenvolvedor Front-End.

- 🧠 **GitHub:** [MarcosGardinali](https://github.com/MarcosGardinali)  
- 💬 **LinkedIn:** [linkedin.com/in/marcos-gardinali](https://linkedin.com/in/marcos-gardinali)  

> “Building systems that hunt the impossible.” 🦆
---