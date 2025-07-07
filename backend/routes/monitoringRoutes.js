const express = require('express');
const router = express.Router();

// Controller
const {
  getMonitoringConfigs,
  getMonitoringConfigById,
  createMonitoringConfig,
  updateMonitoringConfig,
  deleteMonitoringConfig
} = require('../controllers/monitoringController');

// Middleware
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// ✅ Require authentication for all routes
router.use(auth);

/**
 * @route   GET /api/monitoring
 * @desc    Get all monitoring configurations
 * @access  Admin only
 */
router.get('/', getMonitoringConfigs);

/**
 * @route   GET /api/monitoring/:id
 * @desc    Get a specific monitoring configuration by ID
 * @access  Admin only
 */
router.get('/:id', getMonitoringConfigById);

/**
 * @route   POST /api/monitoring
 * @desc    Create a new monitoring configuration
 * @access  Admin only
 */
router.post('/', role(['admin']), createMonitoringConfig);

/**
 * @route   PUT /api/monitoring/:id
 * @desc    Update an existing monitoring configuration
 * @access  Admin only
 */
router.put('/:id', role(['admin']), updateMonitoringConfig);

/**
 * @route   DELETE /api/monitoring/:id
 * @desc    Delete a monitoring configuration
 * @access  Admin only
 */
router.delete('/:id', role(['admin']), deleteMonitoringConfig);

module.exports = router;
