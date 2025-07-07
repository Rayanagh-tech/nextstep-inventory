const express = require('express');
const router = express.Router();

// Import controller functions for alerts
const {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert
} = require('../controllers/alertController');

// Import middleware to secure routes
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// ✅ Apply authentication middleware to all alert routes
router.use(auth);

/**
 * @route   GET /api/alerts
 * @desc    Get all alert configurations
 * @access  Authenticated users (all roles)
 */
router.get('/', getAlerts);

/**
 * @route   POST /api/alerts
 * @desc    Create a new alert configuration
 * @access  Admin only
 */
router.post('/', role(['admin']), createAlert);

/**
 * @route   PUT /api/alerts/:id
 * @desc    Update an existing alert configuration
 * @access  Admin only
 */
router.put('/:id', role(['admin']), updateAlert);

/**
 * @route   DELETE /api/alerts/:id
 * @desc    Delete an alert configuration by ID
 * @access  Admin only
 */
router.delete('/:id', role(['admin']), deleteAlert);

// Export the router for use in app.js
module.exports = router;
