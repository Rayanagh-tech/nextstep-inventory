const pool = require('../config/db');

const getAllVMs = async () => {
  return await pool.query('SELECT * FROM vm ORDER BY name');
};

const getVMById = async (id) => {
  return await pool.query('SELECT * FROM vm WHERE id = $1', [id]);
};

const createVM = async (vmData) => {
  const {
    name,
    server_id,
    datacenter_id,
    vsphere_id,
    guest_hostname,
    ip_address,
    os_type,
    os_version,
    vcpu_count,
    memory_gb,
    storage_gb,
    power_state = 'poweredOff',
    tools_status,
    tools_version,
    backup_status,
    owner_email,
    business_unit,
    criticality,
    tags = [],
    vsphere_attributes = {}
  } = vmData;

  const ipArray = Array.isArray(ip_address) ? ip_address : [ip_address];

  return await pool.query(
    `INSERT INTO vm (
      name, server_id, datacenter_id, vsphere_id, guest_hostname, ip_address,
      os_type, os_version, vcpu_count, memory_gb, storage_gb, power_state,
      tools_status, tools_version, backup_status,
      owner_email, business_unit, criticality, tags, vsphere_attributes
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15,
      $16, $17, $18, $19, $20
    )
    RETURNING *`,
    [
      name, server_id, datacenter_id, vsphere_id, guest_hostname, ipArray,
      os_type, os_version, vcpu_count, memory_gb, storage_gb, power_state,
      tools_status, tools_version, backup_status,
      owner_email, business_unit, criticality,
      JSON.stringify(tags), JSON.stringify(vsphere_attributes)
    ]
  );
};

const updateVM = async (id, vmData) => {
  const {
    name,
    server_id,
    datacenter_id,
    vsphere_id,
    guest_hostname,
    ip_address,
    os_type,
    os_version,
    vcpu_count,
    memory_gb,
    storage_gb,
    power_state,
    tools_status,
    tools_version,
    backup_status,
    owner_email,
    business_unit,
    criticality,
    tags = [],
    vsphere_attributes = {}
  } = vmData;

  const ipArray = Array.isArray(ip_address) ? ip_address : [ip_address];

  return await pool.query(
    `UPDATE vm SET
      name = $1,
      server_id = $2,
      datacenter_id = $3,
      vsphere_id = $4,
      guest_hostname = $5,
      ip_address = $6,
      os_type = $7,
      os_version = $8,
      vcpu_count = $9,
      memory_gb = $10,
      storage_gb = $11,
      power_state = $12,
      tools_status = $13,
      tools_version = $14,
      backup_status = $15,
      owner_email = $16,
      business_unit = $17,
      criticality = $18,
      tags = $19,
      vsphere_attributes = $20,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $21
    RETURNING *`,
    [
      name,
      server_id,
      datacenter_id,
      vsphere_id,
      guest_hostname,
      ipArray,
      os_type,
      os_version,
      vcpu_count,
      memory_gb,
      storage_gb,
      power_state,
      tools_status,
      tools_version,
      backup_status,
      owner_email,
      business_unit,
      criticality,
      JSON.stringify(tags),
      JSON.stringify(vsphere_attributes),
      id
    ]
  );
};


const deleteVM = async (id) => {
  return await pool.query('DELETE FROM vm WHERE id = $1 RETURNING *', [id]);
};

module.exports = {
  getAllVMs,
  getVMById,
  createVM,
  updateVM,
  deleteVM
};
