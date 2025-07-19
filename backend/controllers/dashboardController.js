const db = require('../config/db');

// 🟢 1. KPI Summary: VMs, Servers, Datacenters, Storage
exports.getDashboardStats = async (req, res) => {
  try {
    const vm = await db.query('SELECT COUNT(*) FROM vm');
    const server = await db.query('SELECT COUNT(*) FROM server');
    const dc = await db.query('SELECT COUNT(*) FROM datacenter');
    const used = await db.query('SELECT SUM(used_capacity_gb) FROM storage_bay');
    const total = await db.query('SELECT SUM(total_capacity_gb) FROM storage_bay');

    const usage =
      total.rows[0].sum > 0
        ? ((used.rows[0].sum / total.rows[0].sum) * 100).toFixed(2)
        : '0.00';

    res.json({
      totalVMs: parseInt(vm.rows[0].count),
      totalServers: parseInt(server.rows[0].count),
      totalDatacenters: parseInt(dc.rows[0].count),
      storageUsagePercent: usage,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
};

// 📈 2. VM Trends (last 24 hours)
exports.getVmTrends = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        DATE_TRUNC('hour', logged_at) AS hour,
        AVG(cpu_usage) AS avg_cpu,
        AVG(ram_usage) AS avg_ram
      FROM monitoring_log
      WHERE logged_at >= NOW() - INTERVAL '24 hours'
      GROUP BY hour
      ORDER BY hour
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load VM trends' });
  }
};

// 🏢 3. Datacenter Metrics (latest snapshot)
exports.getDatacenterMetrics = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT dm.*, d.name AS datacenter_name
      FROM datacenter_metrics dm
      JOIN datacenter d ON d.id = dm.datacenter_id
      WHERE dm.recorded_at = (
        SELECT MAX(recorded_at)
        FROM datacenter_metrics
        WHERE datacenter_id = dm.datacenter_id
      )
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load datacenter metrics' });
  }
};

// 💽 4. Storage usage per datacenter
exports.getStorageUsage = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.name AS datacenter, SUM(s.used_capacity_gb) AS used, SUM(s.total_capacity_gb) AS total
      FROM storage_bay s
      JOIN datacenter d ON d.id = s.datacenter_id
      GROUP BY d.name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load storage usage' });
  }
};

// ❤️ 5. Heartbeats
exports.getSystemHeartbeats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM system_log
      WHERE action = 'Dashboard heartbeat OK'
      ORDER BY created_at DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load system logs' });
  }
};

// 🕵️ 6. Recent activity (last 10 inserts into monitoring)
exports.getRecentActivity = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT m.*, v.name AS vm_name
      FROM monitoring_log m
      JOIN vm v ON v.id = m.vm_id
      ORDER BY m.logged_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load activity logs' });
  }
};

exports.getVmMetrics = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT vm_metrics.*, vm.name AS vm_name
      FROM vm_metrics
      JOIN vm ON vm.id = vm_metrics.vm_id
      ORDER BY vm_metrics.logged_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching VM metrics:", err);
    res.status(500).json({ error: "Failed to fetch VM metrics" });
  }
};
