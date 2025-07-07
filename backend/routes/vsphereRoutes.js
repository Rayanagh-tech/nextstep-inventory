const express = require('express');
const router = express.Router();
const vsphereController = require('../controllers/vsphereController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🔐 Protect all vSphere routes
router.use(auth);

/**
 * @route   GET /api/vsphere
 * @desc    Get all vSphere connections (safe fields only)
 * @access  Authenticated
 */
router.get('/', vsphereController.getConnections);

/**
 * @route   POST /api/vsphere/test
 * @desc    Simulate/test a vSphere connection (mock for now)
 * @access  Authenticated
 */
router.post('/test', vsphereController.testConnection);

/**
 * @route   POST /api/vsphere
 * @desc    Create a new vSphere connection
 * @access  Authenticated (both admin and user)
 */
router.post('/', role(['admin', 'user']), vsphereController.createConnection);

/**
 * @route   PUT /api/vsphere/:id
 * @desc    Update an existing vSphere connection
 * @access  Authenticated
 */
router.put('/:id', vsphereController.updateConnection);

/**
 * @route   DELETE /api/vsphere/:id
 * @desc    Delete a vSphere connection
 * @access  Admin only
 */
router.delete('/:id', vsphereController.deleteConnection);

module.exports = router;
