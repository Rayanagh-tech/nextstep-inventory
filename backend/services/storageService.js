const pool = require('../config/db');

// Get all storage bays
const getAll = async () => {
  const result = await pool.query('SELECT * FROM storage_bay ORDER BY name');
  return result.rows;
};

// Get storage bay by ID
const getById = async (id) => {
  const result = await pool.query('SELECT * FROM storage_bay WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async ({
  datacenter_id,
  vsphere_datastore_id,
  name,
  type,
  protocol,
  total_capacity_gb,
  used_capacity_gb,
  free_capacity_gb,
  status = 'active',
  storage_type,
  last_sync = new Date(),
  tags = []
}) => {
  const result = await pool.query(
    `INSERT INTO storage_bay (
      datacenter_id,
      vsphere_datastore_id,
      name,
      type,
      protocol,
      total_capacity_gb,
      used_capacity_gb,
      free_capacity_gb,
      status,
      storage_type,
      last_sync,
      tags
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12
    ) RETURNING *`,
    [
      datacenter_id,
      vsphere_datastore_id,
      name,
      type,
      protocol,
      total_capacity_gb,
      used_capacity_gb,
      free_capacity_gb,
      status,
      storage_type,
      last_sync,
      JSON.stringify(tags) // ✅ Must be a JSON string for jsonb column
    ]
  );
  return result.rows[0];
};




// Update a storage bay
const update = async (id, { datacenter_id, name, total_capacity_gb, used_capacity_gb, status }) => {
  const result = await pool.query(
    `UPDATE storage_bay
     SET datacenter_id = $1, name = $2, total_capacity_gb = $3,
         used_capacity_gb = $4, status = $5
     WHERE id = $6 RETURNING *`,
    [datacenter_id, name, total_capacity_gb, used_capacity_gb, status, id]
  );
  return result.rows[0];
};

// Delete a storage bay
const remove = async (id) => {
  const result = await pool.query('DELETE FROM storage_bay WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
