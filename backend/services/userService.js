const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all users
const getAll = async () => {
  const result = await pool.query(
    `SELECT id, username, email, role, vsphere_access_level, 
            mfa_enabled, last_login, department, phone, job_title 
     FROM "user" 
     ORDER BY created_at DESC`
  );
  return result.rows;
};

// Get user by ID
const getById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, email, role, vsphere_access_level, 
            mfa_enabled, last_login, department, phone, job_title 
     FROM "user" WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Create new user
const create = async ({
  username,
  email,
  password,
  role = 'user',
  vsphere_access_level = 'read-only',
  department = '',
  phone = '',
  job_title = '',
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO "user" (username, email, password_hash, role, vsphere_access_level, department, phone, job_title)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, username, email, role`,
    [username, email, hashedPassword, role, vsphere_access_level, department, phone, job_title]
  );
  return result.rows[0];
};

// ✅ Update user with safe fallback to existing values
const update = async (
  id,
  {
    username,
    email,
    password,
    role,
    vsphere_access_level,
    department,
    phone,
    job_title,
  }
) => {
  const existing = await pool.query('SELECT * FROM "user" WHERE id = $1', [id]);
  if (existing.rows.length === 0) return null;

  const current = existing.rows[0];

  const password_hash = password
    ? await bcrypt.hash(password, 10)
    : current.password_hash;

  const result = await pool.query(
    `UPDATE "user"
     SET username = $1,
         email = $2,
         password_hash = $3,
         role = $4,
         vsphere_access_level = $5,
         department = $6,
         phone = $7,
         job_title = $8,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING id, username, email, role, department, phone, job_title`,
    [
      username || current.username,
      email || current.email,
      password_hash,
      role || current.role,
      vsphere_access_level || current.vsphere_access_level,
      department || current.department,
      phone || current.phone,
      job_title || current.job_title,
      id,
    ]
  );

  return result.rows[0];
};

// Delete user
const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM "user" WHERE id = $1 RETURNING id, username, email',
    [id]
  );
  return result.rows[0];
};


const getUserWithPassword = async (id) => {
  const result = await pool.query(
    `SELECT id, password_hash FROM "user" WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};
const updateUserPassword = async (id, hashedPassword) => {
  await pool.query(
    `UPDATE "user" SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [hashedPassword, id]
  );
 

};

const updateMfaSetting = async (userId, mfa_enabled) => {
  const result = await pool.query(
    'UPDATE "user" SET mfa_enabled = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [mfa_enabled, userId]
  );
  return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove, getUserWithPassword, updateUserPassword, updateMfaSetting };
