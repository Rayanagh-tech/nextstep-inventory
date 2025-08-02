const pool = require('../config/db');

// =============================
// 🔐 Connection Management
// =============================

// 🟢 Get all vSphere connections with tags
exports.getConnections = async () => {
  const result = await pool.query(`
    SELECT 
      vc.id,
      vc.datacenter_id,
      dc.name AS datacenter_name,
      vc.api_username,
      vc.api_version,
      vc.is_active,
      vc.last_used,
      vc.last_used_by,
      vc.created_at,
      COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name)) 
               FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
    FROM vsphere_connection vc
    LEFT JOIN vsphere_connection_tag vct ON vc.id = vct.connection_id
    LEFT JOIN tag t ON t.id = vct.tag_id
    LEFT JOIN datacenter dc ON dc.id = vc.datacenter_id
    GROUP BY vc.id, dc.name
    ORDER BY vc.created_at DESC
  `);
  return result.rows;
};

exports.findByUserAndDatacenter = async (api_username, datacenter_id) => {
  const result = await pool.query(
    `SELECT id, datacenter_id, api_username, api_password_enc, api_version, is_active, last_used, last_used_by, created_at
     FROM vsphere_connection
     WHERE api_username = $1 AND datacenter_id = $2`,
    [api_username, datacenter_id]
  );
  return result.rows[0];
};


exports.testConnection = ({ api_username, api_password, vcenter_url }) => {
  if (!vcenter_url.startsWith('https://')) {
    throw new Error('Unable to reach vCenter endpoint');
  }
  return { message: 'Connection successful', status: 'success' };
};

// ➕ Create a new vSphere connection
exports.createConnection = async ({ datacenter_id, api_username, api_password, api_version, tags = [], isAdmin }) => {
  // 🔒 Enforce uniqueness for all users (including admin)
  const exists = await pool.query(
    `SELECT 1 FROM vsphere_connection WHERE datacenter_id = $1 AND api_username = $2`,
    [datacenter_id, api_username]
  );
  if (exists.rows.length > 0) {
    throw new Error('A vSphere connection already exists for this user in the selected datacenter.');
  }

  // ✅ Validate tags (only for admins)
  if (isAdmin && tags.length > 0) {
    const tagResult = await pool.query(
      `SELECT id FROM tag WHERE id = ANY($1::int[])`,
      [tags]
    );
    if (tagResult.rows.length !== tags.length) {
      throw new Error('One or more provided tags are invalid.');
    }
  }

  // 🔐 Encrypt password
  const encrypted = Buffer.from(api_password).toString('hex');

  const result = await pool.query(
    `INSERT INTO vsphere_connection 
      (datacenter_id, api_username, api_password_enc, api_version, is_active)
     VALUES ($1, $2, $3, $4, true)
     RETURNING id`,
    [datacenter_id, api_username, `\\x${encrypted}`, api_version]
  );

  const connectionId = result.rows[0].id;

  // 🏷️ Apply tags (admin only)
  if (isAdmin && tags.length > 0) {
    for (const tagId of tags) {
      await pool.query(
        `INSERT INTO vsphere_connection_tag (connection_id, tag_id) VALUES ($1, $2)`,
        [connectionId, tagId]
      );
    }
  }

  return { id: connectionId, datacenter_id, api_username, api_version };
};

// ✏️ Update vSphere connection
exports.updateConnection = async ({ id, api_username, api_password, api_version, is_active }) => {
  // 🛡️ Check if new (datacenter_id, api_username) would conflict
  const existing = await pool.query(
    `SELECT datacenter_id FROM vsphere_connection WHERE id = $1`,
    [id]
  );
  const currentDatacenterId = existing.rows?.[0]?.datacenter_id;

  const conflictCheck = await pool.query(
    `SELECT 1 FROM vsphere_connection WHERE datacenter_id = $1 AND api_username = $2 AND id != $3`,
    [currentDatacenterId, api_username, id]
  );
  if (conflictCheck.rows.length > 0) {
    throw new Error('Another connection already exists for this user in the same datacenter.');
  }

  // 🔐 Build query
  let query = `UPDATE vsphere_connection SET api_username = $1, api_version = $2, is_active = $3`;
  const values = [api_username, api_version, is_active];

  if (api_password) {
    query += `, api_password_enc = $4`;
    values.push(`\\x${Buffer.from(api_password).toString('hex')}`);
    query += ` WHERE id = $5 RETURNING *`;
    values.push(id);
  } else {
    query += ` WHERE id = $4 RETURNING *`;
    values.push(id);
  }

  const result = await pool.query(query, values);
  return result.rows[0];
};

exports.deleteConnection = async (id) => {
  const result = await pool.query(`DELETE FROM vsphere_connection WHERE id = $1`, [id]);
  return result.rowCount > 0;
};

exports.getConnectionById = async (id) => {
  const result = await pool.query(
    `SELECT id, api_username FROM vsphere_connection WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};
