const pool = require('../config/db');

// Get audit logs with optional filters and pagination
exports.getAuditLogs = async ({ user_id, action, limit = 100, offset = 0 }) => {
  const values = [];
  const whereClauses = [];

  if (user_id) {
    values.push(user_id);
    whereClauses.push(`user_id = $${values.length}`);
  }

  if (action) {
    values.push(action);
    whereClauses.push(`action ILIKE $${values.length}`);
  }

  values.push(limit, offset);
  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const result = await pool.query(
    `SELECT * FROM audit_log ${whereSQL}
     ORDER BY timestamp DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return result.rows;
};
