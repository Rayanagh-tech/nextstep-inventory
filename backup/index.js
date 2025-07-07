require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('../backend/utils/logger'); // you can define your winston logger in utils/logger.js
const db = require('../backend/config/db'); // pool imported from config

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// TODO: Add your routes here (example)
// const vmRoutes = require('../routes/vmRoutes');
// app.use('/api/vms', vmRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server only when file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
