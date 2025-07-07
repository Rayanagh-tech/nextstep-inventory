const express = require('express');
const router = express.Router();

// Controller
const {
  getAllStorageBays,
  getStorageBayById,
  createStorageBay,
  updateStorageBay,
  deleteStorageBay
} = require('../controllers/storageController');

// Middleware
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🔐 Require authentication for all routes
router.use(auth);

/**
 * @route   GET /api/storage-bays
 * @desc    Get all storage bays
 * @access  Viewer, Operator, Admin
 */
router.get('/', getAllStorageBays);

/**
 * @route   GET /api/storage-bays/:id
 * @desc    Get storage bay by ID
 * @access  Viewer, Operator, Admin
 */
router.get('/:id', getStorageBayById);

/**
 * @route   POST /api/storage-bays
 * @desc    Create a new storage bay
 * @access  Admin only
 */
router.post('/', role(['admin']), createStorageBay);

/**
 * @route   PUT /api/storage-bays/:id
 * @desc    Update a storage bay
 * @access  Admin only
 */
router.put('/:id', role(['admin']), updateStorageBay);

/**
 * @route   DELETE /api/storage-bays/:id
 * @desc    Delete a storage bay
 * @access  Admin only
 */
router.delete('/:id', role(['admin']), deleteStorageBay);

module.exports = router;
