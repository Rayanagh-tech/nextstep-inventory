const pool = require('../config/db');

// 🔍 Get all monitoring configurations
exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM monitoring_configuration ORDER BY created_at DESC');
  return result.rows;
};

// 🔍 Get one by ID
exports.getById = async (id) => {
  const result = await pool.query('SELECT * FROM monitoring_configuration WHERE id = $1', [id]);
  return result.rows[0];
};

// ➕ Create
exports.create = async ({ datacenter_id, metric_type, threshold, enabled, notification_level }) => {
  const result = await pool.query(
    `INSERT INTO monitoring_configuration (datacenter_id, metric_type, threshold, enabled, notification_level)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [datacenter_id, metric_type, threshold, enabled, notification_level]
  );
  return result.rows[0];
};

// 🖊️ Update
exports.update = async (id, { metric_type, threshold, enabled, notification_level }) => {
  const result = await pool.query(
    `UPDATE monitoring_configuration 
     SET metric_type = $1, threshold = $2, enabled = $3, notification_level = $4
     WHERE id = $5 RETURNING *`,
    [metric_type, threshold, enabled, notification_level, id]
  );
  return result.rows[0];
};

// ❌ Delete
exports.remove = async (id) => {
  const result = await pool.query('DELETE FROM monitoring_configuration WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
