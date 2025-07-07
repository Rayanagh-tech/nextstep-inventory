const vmService = require('../services/vmService');

exports.getAllVMs = async (req, res) => {
  try {
    const result = await vmService.getAllVMs();
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching VMs:', err.message);
    res.status(500).json({ error: 'Failed to retrieve virtual machines' });
  }
};

exports.getVMById = async (req, res) => {
  try {
    const result = await vmService.getVMById(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Virtual machine not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching VM:', err.message);
    res.status(500).json({ error: 'Failed to retrieve VM' });
  }
};

exports.createVM = async (req, res) => {
  const { name, server_id, datacenter_id, vsphere_id } = req.body;

  if (!name || !vsphere_id || !datacenter_id) {
    return res.status(400).json({ error: 'Missing required fields: name, vsphere_id, datacenter_id' });
  }

  try {
    console.log("📥 Request Body:", req.body);
    const result = await vmService.createVM(req.body);
    console.log("✅ VM Created:", result.rows[0]);
    res.status(201).json({ message: 'Virtual machine created', vm: result.rows[0] });
  } catch (err) {
    console.error('❌ VM creation failed:', err.stack || err);
    res.status(500).json({ error: err.message || 'Failed to create virtual machine' });
  }
};



exports.updateVM = async (req, res) => {
  try {
    const result = await vmService.updateVM(req.params.id, req.body);
    if (result.rows.length === 0) return res.status(404).json({ error: 'VM not found' });
    res.status(200).json({ message: 'VM updated', vm: result.rows[0] });
  } catch (err) {
    console.error('Error updating VM:', err.message);
    res.status(500).json({ error: 'Failed to update VM' });
  }
};

exports.deleteVM = async (req, res) => {
  try {
    const result = await vmService.deleteVM(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'VM not found' });
    res.status(200).json({ message: 'VM deleted successfully' });
  } catch (err) {
    console.error('Error deleting VM:', err.message);
    res.status(500).json({ error: 'Failed to delete VM' });
  }
};
