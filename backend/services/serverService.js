const pool = require('../config/db');

// 📄 Get all servers
const getAll = async () => {
  const result = await pool.query('SELECT * FROM server ORDER BY hostname');
  return result.rows;
};

// 🔍 Get server by ID
const getById = async (id) => {
  const result = await pool.query('SELECT * FROM server WHERE id = $1', [id]);
  return result.rows[0];
};


// ➕ Create server
const create = async ({
  datacenter_id,
  hostname,
  ip_address,
  status = 'active',
  model,
  manufacturer,
  serial_number,
  cpu_sockets,
  cpu_cores,
  cpu_threads,
  cpu_model,
  cpu_speed_ghz,
  total_ram_gb,
  installed_ram_gb,
  cluster_name,
  esxi_version,
  fqdn,
  vsphere_host_id,
  vsphere_connection_status,
  tags = [],
  custom_attributes = {}
}) => {
  const result = await pool.query(
    `INSERT INTO server (
      datacenter_id, hostname, ip_address, status,
      model, manufacturer, serial_number, cpu_sockets,
      cpu_cores, cpu_threads, cpu_model, cpu_speed_ghz,
      total_ram_gb, installed_ram_gb, cluster_name,
      esxi_version, fqdn, vsphere_host_id, vsphere_connection_status,
      tags, custom_attributes
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11, $12,
      $13, $14, $15,
      $16, $17, $18, $19,
      $20, $21
    ) RETURNING *`,
    [
      datacenter_id, hostname, ip_address, status,
      model, manufacturer, serial_number, cpu_sockets,
      cpu_cores, cpu_threads, cpu_model, cpu_speed_ghz,
      total_ram_gb, installed_ram_gb, cluster_name,
      esxi_version, fqdn, vsphere_host_id, vsphere_connection_status,
      JSON.stringify(tags), JSON.stringify(custom_attributes)
    ]
  );

  return result.rows[0];
};

// 🖊️ Update server
const update = async (id, updates) => {
  const fields = [
    'datacenter_id', 'hostname', 'ip_address', 'status',
    'model', 'manufacturer', 'serial_number', 'cpu_sockets',
    'cpu_cores', 'cpu_threads', 'cpu_model', 'cpu_speed_ghz',
    'total_ram_gb', 'installed_ram_gb', 'cluster_name',
    'esxi_version', 'fqdn', 'vsphere_host_id', 'vsphere_connection_status',
    'tags', 'custom_attributes'
  ];

  const assignments = [];
  const values = [];
  let idx = 1;

  for (const field of fields) {
    if (field in updates) {
      assignments.push(`${field} = $${idx}`);
      const value = ['tags', 'custom_attributes'].includes(field)
        ? JSON.stringify(updates[field])
        : updates[field];
      values.push(value);
      idx++;
    }
  }

  if (assignments.length === 0) {
    throw new Error('No valid fields provided for update');
  }

  const query = `
    UPDATE server
    SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${idx}
    RETURNING *`;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// ❌ Delete server
const remove = async (id) => {
  const result = await pool.query('DELETE FROM server WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
