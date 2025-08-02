const cron = require('node-cron');
const { collectMetrics } = require('./scripts/monitoringAgent');
const { logHeartbeat } = require('./scripts/systemLogger');
const { generateVmMetrics } = require('./scripts/vmMetricsGenerator');


console.log('📆 Cron scheduler started');
 
// Collect monitoring data every 5 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('🕒 Running monitoring agent...');
  collectMetrics();
});

// Log system heartbeat every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('🕒 Logging system heartbeat...');
  logHeartbeat();
});
// 🟢 Generate synthetic VM metrics every 5 minutes
cron.schedule('*/10 * * * *', async () => {
  await generateVmMetrics();
});
