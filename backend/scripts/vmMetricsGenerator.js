const db = require('../config/db');

/**
 * Inserts synthetic VM metrics for each VM in the database
 */
async function generateVmMetrics() {
  console.log('📊 Generating synthetic VM metrics...');

  try {
    const vmResult = await db.query('SELECT id, name FROM vm');

    if (vmResult.rows.length === 0) {
      console.log('⚠️ No VMs found to generate metrics.');
      return;
    }

    for (const vm of vmResult.rows) {
      const cpu = (Math.random() * 100).toFixed(2);
      const ram = (Math.random() * 100).toFixed(2);
      const uptime = (90 + Math.random() * 10).toFixed(2); // 90-100%
      const status =
        cpu > 90 || ram > 90 ? 'error' : cpu > 75 || ram > 75 ? 'warning' : 'success';

      await db.query(
        `INSERT INTO vm_metrics (vm_id, vm_name, cpu_usage, ram_usage, uptime_percent, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [vm.id, vm.name, cpu, ram, uptime, status]
      );
    }

    console.log(`✅ Inserted metrics for ${vmResult.rows.length} VMs.`);
  } catch (err) {
    console.error('❌ Error generating VM metrics:', err.message);
  }
}

module.exports = { generateVmMetrics };
