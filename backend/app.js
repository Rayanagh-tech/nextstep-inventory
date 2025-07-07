// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/vms', require('./routes/vmRoutes'));
app.use('/api/servers', require('./routes/serverRoutes'));
app.use('/api/storage-bays', require('./routes/storageRoutes'));
app.use('/api/datacenters', require('./routes/datacenterRoutes'));
app.use('/api/monitoring', require('./routes/monitoringRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/backup-policies', require('./routes/backupPolicyRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vsphere', require('./routes/vsphereRoutes'));
app.use('/api/audit', require('./routes/auditLogRoutes'));


// Root route for health check
app.get('/', (req, res) => {
  res.send('✅ NextStep Inventory API is running!');
});


// Error handler (last middleware)
app.use(errorHandler);

module.exports = app;
