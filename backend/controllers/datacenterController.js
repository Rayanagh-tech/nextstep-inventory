const datacenterService = require('../services/datacenterService');

// 🔍 Get one
const getDatacenterById = async (req, res) => {
  try {
    const datacenter = await datacenterService.getById(req.params.id);
    if (!datacenter) return res.status(404).json({ error: 'Datacenter not found' });
    res.json(datacenter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📦 Get all
const getAllDatacenters = async (req, res) => {
  try {
    const data = await datacenterService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Create
const createDatacenter = async (req, res) => {
  try {
    const created = await datacenterService.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📝 Update
const updateDatacenter = async (req, res) => {
  try {
    const updated = await datacenterService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Datacenter not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ❌ Delete
const deleteDatacenter = async (req, res) => {
  try {
    const deleted = await datacenterService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Datacenter not found' });
    res.json({ message: 'Datacenter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDatacenterById,
  getAllDatacenters,
  createDatacenter,
  updateDatacenter,
  deleteDatacenter
};


