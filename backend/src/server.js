require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('../database');

const PORT = process.env.PORT || 8765;

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, '0.0.0.0');
  } catch (error) {
    process.exit(1);
  }
};

startServer();