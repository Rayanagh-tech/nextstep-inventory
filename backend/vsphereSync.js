require('dotenv').config({ path: __dirname + '/.env' }); // ✅ this file is in /backend, so direct path
console.log("✅ DB config loaded:", process.env.DB_USER, process.env.DB_PASSWORD);


const cron = require('node-cron');
const { syncAllVMs } = require('./services/vsphereSyncService');

// Run every 5 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    await syncAllVMs();
  } catch (err) {
    console.error("❌ Sync job failed:", err.message);
  }
});
