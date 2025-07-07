const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Register new user
exports.registerUser = async ({
  username,
  email,
  password,
  role = 'user',
  vsphere_access_level = 'read-only',
  department = '',
  phone = '',
  job_title = '',
}) => {
  // Check if email already exists
  const emailCheck = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
  if (emailCheck.rows.length > 0) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Insert user
  const result = await pool.query(
    `INSERT INTO "user" 
     (username, email, password_hash, role, vsphere_access_level, department, phone, job_title) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING id, username, email, role, vsphere_access_level, department, phone, job_title`,
    [username, email, hashedPassword, role, vsphere_access_level, department, phone, job_title]
  );

  const user = result.rows[0];
  const token = generateToken(user);

  return { user, token };
};

// Login user
exports.loginUser = async ({ email, password }) => {
  const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      vsphere_access_level: user.vsphere_access_level,
      department: user.department,
      phone: user.phone,
      job_title: user.job_title,
    },
  };
};
