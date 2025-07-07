const monitoringService = require('../services/monitoringService');

// 📄 GET all
exports.getMonitoringConfigs = async (req, res) => {
  try {
    const configs = await monitoringService.getAll();
    res.status(200).json(configs);
  } catch (err) {
    console.error('Error fetching monitoring configurations:', err.message);
    res.status(500).json({ error: 'Could not fetch monitoring configurations' });
  }
};

// 🔍 GET one by ID
exports.getMonitoringConfigById = async (req, res) => {
  try {
    const config = await monitoringService.getById(req.params.id);
    if (!config) return res.status(404).json({ error: 'Monitoring configuration not found' });
    res.status(200).json(config);
  } catch (err) {
    console.error('Error fetching monitoring config:', err.message);
    res.status(500).json({ error: 'Could not fetch monitoring configuration' });
  }
};

// ➕ POST
exports.createMonitoringConfig = async (req, res) => {
  const { datacenter_id, metric_type, threshold, enabled = true, notification_level } = req.body;

  if (!datacenter_id || !metric_type || threshold == null || !notification_level) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const config = await monitoringService.create({ datacenter_id, metric_type, threshold, enabled, notification_level });
    res.status(201).json(config);
  } catch (err) {
    console.error('Error creating monitoring configuration:', err.message);
    res.status(500).json({ error: 'Failed to create monitoring configuration' });
  }
};

// 🖊️ PUT
exports.updateMonitoringConfig = async (req, res) => {
  const { id } = req.params;
  const { metric_type, threshold, enabled, notification_level } = req.body;

  try {
    const updated = await monitoringService.update(id, { metric_type, threshold, enabled, notification_level });
    if (!updated) return res.status(404).json({ error: 'Monitoring configuration not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating monitoring configuration:', err.message);
    res.status(500).json({ error: 'Failed to update monitoring configuration' });
  }
};

// ❌ DELETE
exports.deleteMonitoringConfig = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await monitoringService.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Monitoring configuration not found' });
    res.status(200).json({ message: 'Monitoring configuration deleted successfully' });
  } catch (err) {
    console.error('Error deleting monitoring configuration:', err.message);
    res.status(500).json({ error: 'Failed to delete monitoring configuration' });
  }
};
