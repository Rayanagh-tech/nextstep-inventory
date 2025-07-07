const backupPolicyService = require('../services/backupPolicyService');

// 📄 Get all backup policies
exports.getBackupPolicies = async (req, res) => {
  try {
    const policies = await backupPolicyService.getAllPolicies();
    res.status(200).json({ policies });
  } catch (err) {
    console.error('Error fetching backup policies:', err.message);
    res.status(500).json({ error: 'Could not retrieve backup policies' });
  }
};

// 🔍 Get a backup policy by ID
exports.getBackupPolicyById = async (req, res) => {
  try {
    const policy = await backupPolicyService.getPolicyById(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Backup policy not found' });
    res.status(200).json(policy);
  } catch (err) {
    console.error('Error retrieving backup policy:', err.message);
    res.status(500).json({ error: 'Could not retrieve backup policy' });
  }
};

// ➕ Create a new backup policy
exports.createBackupPolicy = async (req, res) => {
  const { datacenter_id, policy_name, retention_days, backup_type, schedule_type } = req.body;

  // Validate required fields
  if (!datacenter_id || !policy_name || retention_days == null || !backup_type || !schedule_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newPolicy = await backupPolicyService.createPolicy({
      datacenter_id,
      policy_name,
      retention_days,
      backup_type,
      schedule_type,
    });

    res.status(201).json(newPolicy);
  } catch (err) {
    console.error('Error creating backup policy:', err.message);
    res.status(500).json({ error: 'Failed to create backup policy' });
  }
};

// 🖊️ Update an existing backup policy
exports.updateBackupPolicy = async (req, res) => {
  const { policy_name, retention_days, backup_type, schedule_type } = req.body;

  try {
    const updatedPolicy = await backupPolicyService.updatePolicy(req.params.id, {
      policy_name,
      retention_days,
      backup_type,
      schedule_type,
    });

    if (!updatedPolicy) return res.status(404).json({ error: 'Backup policy not found' });

    res.status(200).json(updatedPolicy);
  } catch (err) {
    console.error('Error updating backup policy:', err.message);
    res.status(500).json({ error: 'Failed to update backup policy' });
  }
};

// ❌ Delete a backup policy
exports.deleteBackupPolicy = async (req, res) => {
  try {
    const deleted = await backupPolicyService.deletePolicy(req.params.id);

    if (!deleted) return res.status(404).json({ error: 'Backup policy not found' });

    res.status(200).json({ message: 'Backup policy deleted successfully' });
  } catch (err) {
    console.error('Error deleting backup policy:', err.message);
    res.status(500).json({ error: 'Failed to delete backup policy' });
  }
};
