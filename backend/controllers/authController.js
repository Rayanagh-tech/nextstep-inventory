const authService = require('../services/authService');
const pool = require('../config/db'); // adjust path if needed

const register = async (req, res) => {
  const { firstName, lastName, email, password, role, department, phone, job_title } = req.body;
  console.log('📨 Received from frontend:', req.body); // 👈 ADD THIS

  const username = `${firstName} ${lastName}`; // 👈 build full name

  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !role?.trim() ||
    !department?.trim() ||
    !phone?.trim() ||
    !job_title?.trim()
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  

  try {
    const { user, token } = await authService.registerUser({ username, email, password, role, department, phone, job_title  });
    res.status(201).json({ message: 'User registered', token, user });
  } catch (error) {
    console.error('Registration error:', error.message);
    const status = error.message.includes('registered') ? 409 : 500;
    res.status(status).json({ error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await authService.loginUser({ email, password });

    console.log('✅ Logged in user:', result.user); // Make sure result.user.id exists

    try {
      const updateResult = await pool.query(
        'UPDATE "user" SET last_login = NOW() WHERE id = $1',
        [result.user.id]
      );
      console.log('✅ last_login updated for user ID:', result.user.id);
    } catch (updateError) {
      console.error('❌ Error updating last_login:', updateError.message);
    }

    res.json({ message: 'Login successful', ...result });
  } catch (error) {
    console.error('Login error:', error.message);
    const status = error.message.includes('credentials') ? 401 : 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = { register, login };
