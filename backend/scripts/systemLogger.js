const db = require('../config/db');

async function logHeartbeat() {
  try {
    await db.query(`
      INSERT INTO system_log (type, action, status)
      VALUES ($1, $2, $3)
    `, ['System', 'Dashboard heartbeat OK', 'info']);

    console.log('📝 Logged dashboard heartbeat');
  } catch (err) {
    console.error('❌ Failed to log heartbeat:', err.message);
  }

  console.error('✅ All metrics logged successfully.systemLogger.js');

}

module.exports = { logHeartbeat };