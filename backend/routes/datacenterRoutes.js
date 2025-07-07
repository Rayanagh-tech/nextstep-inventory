const express = require('express');
const router = express.Router();

// Controller
const {
  getDatacenterById,
  getAllDatacenters,
  createDatacenter,
  updateDatacenter,
  deleteDatacenter
} = require('../controllers/datacenterController');

// Middleware
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// ✅ Apply authentication middleware to all routes
router.use(auth);

/**
 * @route   GET /api/datacenters
 * @desc    Get all datacenters
 * @access  Authenticated users (viewer, operator, admin)
 */
router.get('/', getAllDatacenters);

/**
 * @route   GET /api/datacenters/:id
 * @desc    Get datacenter by ID
 * @access  Authenticated users
 */
router.get('/:id', getDatacenterById);

/**
 * @route   POST /api/datacenters
 * @desc    Create a new datacenter
 * @access  Admin only
 */
router.post('/', role(['admin']), createDatacenter);

/**
 * @route   PUT /api/datacenters/:id
 * @desc    Update an existing datacenter
 * @access  Admin only
 */
router.put('/:id', role(['admin']), updateDatacenter);

/**
 * @route   DELETE /api/datacenters/:id
 * @desc    Delete a datacenter
 * @access  Admin  only
 */
router.delete('/:id', role(['admin']), deleteDatacenter);

module.exports = router;
