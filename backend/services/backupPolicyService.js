const pool = require('../config/db');

// 🔍 Fetch all backup policies
exports.getAllPolicies = async () => {
  const result = await pool.query('SELECT * FROM backup_policy ORDER BY created_at DESC');
  return result.rows;
};

// 📘 Get a single backup policy by ID
exports.getPolicyById = async (id) => {
  const result = await pool.query('SELECT * FROM backup_policy WHERE id = $1', [id]);
  return result.rows[0];
};

// ➕ Create a new backup policy
exports.createPolicy = async ({ datacenter_id, policy_name, retention_days, backup_type, schedule_type }) => {
  const result = await pool.query(
    `INSERT INTO backup_policy (
       datacenter_id, policy_name, retention_days, backup_type, schedule_type
     )
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [datacenter_id, policy_name, retention_days, backup_type, schedule_type]
  );
  return result.rows[0];
};

// ✏️ Update an existing backup policy
exports.updatePolicy = async (id, { policy_name, retention_days, backup_type, schedule_type }) => {
  const result = await pool.query(
    `UPDATE backup_policy 
     SET policy_name = $1,
         retention_days = $2,
         backup_type = $3,
         schedule_type = $4
     WHERE id = $5 RETURNING *`,
    [policy_name, retention_days, backup_type, schedule_type, id]
  );
  return result.rows[0];
};

// ❌ Delete a backup policy
exports.deletePolicy = async (id) => {
  const result = await pool.query(
    'DELETE FROM backup_policy WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};
