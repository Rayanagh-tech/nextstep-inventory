const storageService = require('../services/storageService');

/**
 * GET /api/storage-bays
 */
const getAllStorageBays = async (req, res) => {
  try {
    const bays = await storageService.getAll();
    res.status(200).json(bays);
  } catch (error) {
    console.error('Error fetching storage bays:', error.message);
    res.status(500).json({ error: 'Failed to retrieve storage bays' });
  }
};

/**
 * GET /api/storage-bays/:id
 */
const getStorageBayById = async (req, res) => {
  try {
    const bay = await storageService.getById(req.params.id);
    if (!bay) return res.status(404).json({ error: 'Storage bay not found' });
    res.status(200).json(bay);
  } catch (error) {
    console.error('Error fetching storage bay:', error.message);
    res.status(500).json({ error: 'Failed to retrieve storage bay' });
  }
};

/**
 * POST /api/storage-bays
 */
const createStorageBay = async (req, res) => {
  try {
    const bay = await storageService.create(req.body);
    res.status(201).json({ message: 'Storage bay created', storage_bay: bay });
  } catch (error) {
    console.error('Error creating storage bay:', error.message);
    res.status(500).json({ error: error.message });
  }
};



/**
 * PUT /api/storage-bays/:id
 */
const updateStorageBay = async (req, res) => {
  try {
    const updated = await storageService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Storage bay not found' });
    res.status(200).json({ message: 'Storage bay updated', storage_bay: updated });
  } catch (error) {
    console.error('Error updating storage bay:', error.message);
    res.status(500).json({ error: 'Failed to update storage bay' });
  }
};

/**
 * DELETE /api/storage-bays/:id
 */
const deleteStorageBay = async (req, res) => {
  try {
    const deleted = await storageService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Storage bay not found' });
    res.status(200).json({ message: 'Storage bay deleted successfully' });
  } catch (error) {
    console.error('Error deleting storage bay:', error.message);
    res.status(500).json({ error: 'Failed to delete storage bay' });
  }
};

module.exports = {
  getAllStorageBays,
  getStorageBayById,
  createStorageBay,
  updateStorageBay,
  deleteStorageBay
};
