const vsphereService = require('../services/vsphereService');

// ✅ Get all vSphere connections
exports.getConnections = async (req, res) => {
  try {
    const connections = await vsphereService.getConnections();
    res.status(200).json({ connections });
  } catch (err) {
    console.error('Error fetching vSphere connections:', err.message);
    res.status(500).json({ error: 'Failed to load connections' });
  }
};

// ✅ Test vSphere connection (mock/test only)
// ✅ Test vSphere connection (only if it's active in DB)
exports.testConnection = async (req, res) => {
  const pool = require('../config/db');
  const { api_username, api_password, vcenter_url } = req.body;

  if (!api_username || !api_password || !vcenter_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT * FROM vsphere_connection WHERE api_username = $1 AND is_active = true`,
      [api_username]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'No active vSphere connection found for this username' });
    }

    const result = vsphereService.testConnection({ api_username, api_password, vcenter_url });
    res.status(200).json(result);
  } catch (err) {
    console.error('vSphere test failed:', err.message);
    res.status(500).json({ error: 'vSphere test failed', details: err.message });
  }
};


// ✅ Create a new vSphere connection
exports.createConnection = async (req, res) => {
  const { datacenter_id, api_password, api_version } = req.body;
  const tags = req.body.tags || [];

  const isAdmin = req.user?.role === 'admin';
  const api_username = isAdmin ? req.body.api_username : req.user?.username;

  if (!datacenter_id || !api_username || !api_password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 🔒 Enforce uniqueness for all users
    const existing = await vsphereService.findByUserAndDatacenter(api_username, datacenter_id);
    if (existing) {
      return res.status(400).json({
        error: 'A vSphere connection already exists for this user in the selected datacenter.',
      });
    }

    // ✅ Create the connection
    const connection = await vsphereService.createConnection({
      datacenter_id,
      api_username,
      api_password,
      api_version,
      tags: isAdmin ? tags : [],
      isAdmin,
    });

    res.status(201).json({ message: 'Connection created', connection });
  } catch (err) {
    console.error('Error creating vSphere connection:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create connection' });
  }
};

// ✅ Update a vSphere connection
exports.updateConnection = async (req, res) => {
  const { id } = req.params;
  const { api_username, api_password, api_version, is_active } = req.body;

  try {
    const updated = await vsphereService.updateConnection({
      id,
      api_username,
      api_password,
      api_version,
      is_active,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.status(200).json({ message: 'Connection updated', connection: updated });
  } catch (err) {
    console.error('Error updating connection:', err.message);
    if (err.message.includes('already exists')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update connection' });
  }
};

// ✅ Delete a vSphere connection
exports.deleteConnection = async (req, res) => {
  const { id } = req.params;
  const requestingUser = req.user;

  try {
    const connResult = await vsphereService.getConnectionById(id);
    if (!connResult) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    const isOwner = connResult.api_username === requestingUser.username;
    const isAdmin = requestingUser.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deleted = await vsphereService.deleteConnection(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.status(200).json({ message: 'Connection deleted' });
  } catch (err) {
    console.error('Error deleting connection:', err.message);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
};
exports.getVMs = async (req, res) => {
  const { datacenter_id } = req.query;
  const api_username = req.user.username;

  try {
    const vms = await vsphereService.listVMPaths(api_username, datacenter_id);
    res.status(200).json({ vms });
  } catch (err) {
    console.error('Error fetching VMs:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getVMDetails = async (req, res) => {
  const { datacenter_id, path } = req.query;
  const api_username = req.user.username;

  try {
    const vm = await vsphereService.getVMInfo(api_username, datacenter_id, path);
    res.status(200).json(vm);
  } catch (err) {
    console.error('Error fetching VM info:', err.message);
    res.status(500).json({ error: err.message });
  }
};
