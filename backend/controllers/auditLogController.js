const auditService = require('../services/auditService');

// GET /api/audit-logs
exports.getAuditLogs = async (req, res) => {
  const { user_id, action, limit, offset } = req.query;

  try {
    const logs = await auditService.getAuditLogs({ user_id, action, limit, offset });
    res.status(200).json({ logs });
  } catch (err) {
    console.error('Error fetching audit logs:', err.message);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};
