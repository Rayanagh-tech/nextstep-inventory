const pool = require('../config/db');

// 📦 Get all datacenters
exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM datacenter');
  return result.rows;
};

// 🔍 Get datacenter by ID
exports.getById = async (id) => {
  const result = await pool.query('SELECT * FROM datacenter WHERE id = $1', [id]);
  return result.rows[0];
};

// ➕ Create datacenter
exports.create = async ({ name, location, description, timezone, vcenter_api_url }) => {
  const result = await pool.query(
    `INSERT INTO datacenter (name, location, description, timezone, vcenter_api_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, location, description, timezone, vcenter_api_url]
  );
  return result.rows[0];
};

// 📝 Update datacenter
exports.update = async (id, { name, location, description, timezone, vcenter_api_url }) => {
  const result = await pool.query(
    `UPDATE datacenter
     SET name = $1, location = $2, description = $3, timezone = $4, vcenter_api_url = $5
     WHERE id = $6 RETURNING *`,
    [name, location, description, timezone, vcenter_api_url, id]
  );
  return result.rows[0];
};

// ❌ Delete datacenter
exports.remove = async (id) => {
  const result = await pool.query('DELETE FROM datacenter WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
