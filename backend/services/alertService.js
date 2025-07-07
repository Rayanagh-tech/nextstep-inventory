const pool = require('../config/db');

// Get all alert configurations
exports.getAllAlerts = async () => {
  const result = await pool.query('SELECT * FROM alert_configuration ORDER BY alert_type');
  return result.rows;
};

// Create a new alert configuration
exports.createAlert = async ({ datacenter_id, alert_type, severity, notification_channels, enabled }) => {
  const result = await pool.query(
    `INSERT INTO alert_configuration (datacenter_id, alert_type, severity, notification_channels, enabled)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [datacenter_id, alert_type, severity, notification_channels, enabled]
  );
  return result.rows[0];
};

// Update an existing alert configuration
exports.updateAlert = async (id, { datacenter_id, alert_type, severity, notification_channels, enabled }) => {
  const result = await pool.query(
    `UPDATE alert_configuration
     SET datacenter_id = $1, alert_type = $2, severity = $3, notification_channels = $4, enabled = $5
     WHERE id = $6 RETURNING *`,
    [datacenter_id, alert_type, severity, notification_channels, enabled, id]
  );
  return result.rows[0];
};

// Delete an alert configuration
exports.deleteAlert = async (id) => {
  const result = await pool.query('DELETE FROM alert_configuration WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
