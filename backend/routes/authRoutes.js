const express = require('express');
const router = express.Router();

// Import controller logic for authentication
const { register, login } = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post('/login', login);

// Export the router for use in app.js
module.exports = router;
