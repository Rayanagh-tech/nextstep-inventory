const alertService = require('../services/alertService');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await alertService.getAllAlerts();
    res.status(200).json(alerts);
  } catch (err) {
    console.error('Error retrieving alerts:', err.message);
    res.status(500).json({ error: 'Could not retrieve alerts' });
  }
};

exports.createAlert = async (req, res) => {
  const { datacenter_id, alert_type, severity, notification_channels, enabled = true } = req.body;

  if (!datacenter_id || !alert_type || !severity || !Array.isArray(notification_channels)) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const alert = await alertService.createAlert({ datacenter_id, alert_type, severity, notification_channels, enabled });
    res.status(201).json(alert);
  } catch (err) {
    console.error('Error creating alert:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateAlert = async (req, res) => {
  const { id } = req.params;
  const { datacenter_id, alert_type, severity, notification_channels, enabled } = req.body;

  try {
    const updatedAlert = await alertService.updateAlert(id, { datacenter_id, alert_type, severity, notification_channels, enabled });

    if (!updatedAlert) {
      return res.status(404).json({ error: 'Alert configuration not found' });
    }

    res.status(200).json(updatedAlert);
  } catch (err) {
    console.error('Error updating alert:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAlert = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await alertService.deleteAlert(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Alert configuration not found' });
    }

    res.status(200).json({ message: 'Alert configuration deleted successfully' });
  } catch (err) {
    console.error('Error deleting alert:', err.message);
    res.status(500).json({ error: err.message });
  }
};
