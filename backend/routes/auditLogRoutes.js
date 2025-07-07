const express = require('express');
const router = express.Router();

// Import the audit log controller
const { getAuditLogs } = require('../controllers/auditLogController');

// Import middleware to secure the route
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// ✅ Protect all audit log routes with JWT authentication
router.use(auth);

/**
 * @route   GET /api/audit
 * @desc    Retrieve audit logs with optional filtering:
 *          - By user_id (UUID)
 *          - By action (string, partial match using ILIKE)
 *          - With pagination (limit, offset)
 * @access  Admin only
 */
router.get('/', role(['admin']), getAuditLogs);

// Export router for use in app.js
module.exports = router;
