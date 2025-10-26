const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Rotas refatoradas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const droneRoutes = require('./routes/drones');
const superpowerRoutes = require('./routes/superpowers');
const primordialDuckRoutes = require('./routes/primordialDucks');
const captureAnalysisRoutes = require('./routes/captureAnalysis');
const droneControlRoutes = require('./routes/droneControl');
const userTourRoutes = require('./routes/userTours');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/api', (req, res) => {
  res.json({ message: 'Coder Challenge 2025 API running' });
});

// Rotas refatoradas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/superpowers', superpowerRoutes);
app.use('/api/primordial-ducks', primordialDuckRoutes);
app.use('/api/capture-analysis', captureAnalysisRoutes);
app.use('/api/drone-control', droneControlRoutes);
app.use('/api/tours', userTourRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

module.exports = app;