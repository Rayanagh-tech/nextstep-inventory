const express = require('express');
const router = express.Router();

// Controller
const {
  getAllServers,
  getServerById,
  createServer,
  updateServer,
  deleteServer
} = require('../controllers/serverController');

// Middleware
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🛡️ Require authentication for all routes
router.use(auth);

/**
 * @route   GET /api/servers
 * @desc    Get all servers
 * @access  Viewer, Operator, Admin
 */
router.get('/', getAllServers);

/**
 * @route   GET /api/servers/:id
 * @desc    Get a specific server by ID
 * @access  Viewer, Operator, Admin
 */
router.get('/:id', getServerById);

/**
 * @route   POST /api/servers
 * @desc    Create a new server
 * @access  Admin only
 */
router.post('/', role(['admin']), createServer);

/**
 * @route   PUT /api/servers/:id
 * @desc    Update server details
 * @access  Admin only
 */
router.put('/:id', role(['admin']), updateServer);

/**
 * @route   DELETE /api/servers/:id
 * @desc    Delete a server
 * @access  Admin only
 */
router.delete('/:id', role(['admin']), deleteServer);

module.exports = router;
