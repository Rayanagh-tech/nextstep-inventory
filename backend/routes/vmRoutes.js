const express = require('express');
const router = express.Router();
const vmController = require('../controllers/vmController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// ✅ All routes require authentication
router.use(auth);

/**
 * @route   GET /api/vms
 * @desc    Get all virtual machines
 * @access  Authenticated
 */
router.get('/', vmController.getAllVMs);

/**
 * @route   GET /api/vms/:id
 * @desc    Get a VM by ID
 * @access  Authenticated
 */
router.get('/:id', vmController.getVMById);

/**
 * @route   POST /api/vms
 * @desc    Create a new VM
 * @access  Admin only
 */
router.post('/', role(['admin']), vmController.createVM);

/**
 * @route   PUT /api/vms/:id
 * @desc    Update an existing VM
 * @access  Admin only
 */
router.put('/:id', role(['admin']), vmController.updateVM);

/**
 * @route   DELETE /api/vms/:id
 * @desc    Delete a VM
 * @access  Admin only
 */
router.delete('/:id', role(['admin']), vmController.deleteVM);

module.exports = router;
