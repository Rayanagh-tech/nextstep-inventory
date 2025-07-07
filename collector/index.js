// collector/index.js
const { Client } = require('pg');
const { sendAlert } = require('./kafkaClient');

const pgClient = new Client({
  host: process.env.LOCAL_DB_HOST || 'localhost',
  port: 5432,
  user: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASS,
  database: 'nextstep_inventory',
});

async function runCollector() {
  try {
    await pgClient.connect();

    const { rows } = await pgClient.query('SELECT * FROM vm');
    for (const vm of rows) {
      if (vm.cpu_usage > 85 || vm.ram_usage > 85 || vm.security_status === 'breach') {
        await sendAlert({
          source: `vm-${vm.id}`,
          severity: 'critical',
          message: `⚠️ Alert: High usage/security issue on ${vm.name}`,
        });
      }
    }
  } catch (err) {
    console.error('❌ Collector error:', err);
  } finally {
    await pgClient.end();
  }
}

runCollector();
