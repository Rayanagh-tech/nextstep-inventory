const db = require('../config/db');
console.log('🧪 monitoringAgent.js started');

async function collectMetrics() {
  try {
    const result = await db.query(`SELECT id, name FROM vm`);

    for (const vm of result.rows) {

      const cpu = (Math.random() * 100).toFixed(2);
      const ram = (Math.random() * 100).toFixed(2);
      const uptime = (99 + Math.random() * 1).toFixed(2);

      await db.query(`
        INSERT INTO monitoring_log (vm_id, cpu_usage, ram_usage, uptime_percent)
        VALUES ($1, $2, $3, $4)
      `, [vm.id, cpu, ram, uptime]);

    }

      // Get all datacenters
    const datacenters = await db.query(`SELECT id FROM datacenter`);

    for (const dc of datacenters.rows) {
      const datacenterId = dc.id;

      // Get all VMs in this datacenter
      const vms = await db.query(`SELECT cpu_usage, ram_usage FROM vm 
        JOIN monitoring_log ON vm.id = monitoring_log.vm_id 
        WHERE vm.datacenter_id = $1 
        AND monitoring_log.logged_at >= NOW() - INTERVAL '5 minutes'`,
        [datacenterId]
      );

      // Compute metrics
      const total_vms = vms.rowCount;
      const avg_cpu = vms.rows.reduce((acc, vm) => acc + parseFloat(vm.cpu_usage), 0) / total_vms || 0;
      const avg_ram = vms.rows.reduce((acc, vm) => acc + parseFloat(vm.ram_usage), 0) / total_vms || 0;

      // Count servers
      const servers = await db.query(`SELECT COUNT(*) FROM server WHERE datacenter_id = $1`, [datacenterId]);
      const total_servers = parseInt(servers.rows[0].count);

      // Aggregate storage used from storage bays
      const storage = await db.query(`
        SELECT SUM(used_capacity_gb) AS used_gb FROM storage_bay WHERE datacenter_id = $1
      `, [datacenterId]);
      const used_tb = (parseFloat(storage.rows[0].used_gb) || 0) / 1024;

      // Insert into datacenter_metrics
      await db.query(`
        INSERT INTO datacenter_metrics (datacenter_id, total_vms, total_servers, avg_cpu_usage, avg_ram_usage, storage_used_tb)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        datacenterId,
        total_vms,
        total_servers,
        avg_cpu.toFixed(2),
        avg_ram.toFixed(2),
        used_tb.toFixed(2)
      ]);

      console.log(`📊 Metrics recorded for datacenter ${datacenterId}`);
    }

    console.log('✅ All datacenter metrics logged successfully.');
  } catch (err) {
    console.error('❌ Error in monitoringAgent:', err.message);
  }
}

// 👇 THIS LINE IS REQUIRED TO ACTUALLY RUN THE FUNCTION
module.exports={collectMetrics}