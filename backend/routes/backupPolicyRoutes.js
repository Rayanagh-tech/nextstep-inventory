const express = require('express');
const router = express.Router();

// Controller functions for backup policies
const {
  getBackupPolicies,
  getBackupPolicyById,
  createBackupPolicy,
  updateBackupPolicy,
  deleteBackupPolicy
} = require('../controllers/backupPolicyController');

// Middleware
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// ✅ Protect all backup policy routes with authentication
router.use(auth);

/**
 * @route   GET /api/backup-policies
 * @desc    Fetch all backup policies
 * @access  Authenticated users (admin/operator/viewer)
 */
router.get('/', getBackupPolicies);

/**
 * @route   GET /api/backup-policies/:id
 * @desc    Fetch a specific backup policy by ID
 * @access  Authenticated users
 */
router.get('/:id', getBackupPolicyById);

/**
 * @route   POST /api/backup-policies
 * @desc    Create a new backup policy
 * @access  Admin only
 */
router.post('/', role(['admin']), createBackupPolicy);

/**
 * @route   PUT /api/backup-policies/:id
 * @desc    Update an existing backup policy
 * @access  Admin only
 */
router.put('/:id', role(['admin']), updateBackupPolicy);

/**
 * @route   DELETE /api/backup-policies/:id
 * @desc    Delete a backup policy
 * @access  Admin only
 */
router.delete('/:id', role(['admin']), deleteBackupPolicy);

module.exports = router;
