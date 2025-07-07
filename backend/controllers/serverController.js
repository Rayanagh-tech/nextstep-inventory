const serverService = require('../services/serverService');

/**
 * GET /api/servers
 */
const getAllServers = async (req, res) => {
  try {
    const servers = await serverService.getAll();
    res.status(200).json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error.message);
    res.status(500).json({ error: 'Failed to retrieve servers' });
  }
};

/**
 * GET /api/servers/:id
 */
const getServerById = async (req, res) => {
  try {
    const server = await serverService.getById(req.params.id);
    if (!server) return res.status(404).json({ error: 'Server not found' });
    res.status(200).json(server);
  } catch (error) {
    console.error('Error fetching server:', error.message);
    res.status(500).json({ error: 'Failed to retrieve server' });
  }
};

/**
 * POST /api/servers
 */
const createServer = async (req, res) => {
  const {
    datacenter_id,
    hostname,
    ip_address,
    status = 'active',
    model,
    manufacturer,
    serial_number,
    cpu_sockets,
    cpu_cores,
    cpu_threads,
    cpu_model,
    cpu_speed_ghz,
    total_ram_gb,
    installed_ram_gb,
    cluster_name,
    esxi_version,
    fqdn,
    vsphere_host_id,
    vsphere_connection_status,
    tags,
    custom_attributes
  } = req.body;

  if (!datacenter_id || !hostname || !ip_address) {
    return res.status(400).json({ error: 'datacenter_id, hostname, and ip_address are required' });
  }

  try {
    const newServer = await serverService.create({
      datacenter_id,
      hostname,
      ip_address,
      status,
      model,
      manufacturer,
      serial_number,
      cpu_sockets,
      cpu_cores,
      cpu_threads,
      cpu_model,
      cpu_speed_ghz,
      total_ram_gb,
      installed_ram_gb,
      cluster_name,
      esxi_version,
      fqdn,
      vsphere_host_id,
      vsphere_connection_status,
      tags,
      custom_attributes
    });

    res.status(201).json({ message: 'Server created', server: newServer });
  } catch (error) {
    console.error('Error creating server:', error.message);
    res.status(500).json({ error: 'Failed to create server' });
  }
};

/**
 * PUT /api/servers/:id
 */
const updateServer = async (req, res) => {
  try {
    const updatedServer = await serverService.update(req.params.id, req.body);
    if (!updatedServer) return res.status(404).json({ error: 'Server not found' });
    res.status(200).json({ message: 'Server updated', server: updatedServer });
  } catch (error) {
    console.error('Error updating server:', error.message);
    res.status(500).json({ error: 'Failed to update server' });
  }
};

/**
 * DELETE /api/servers/:id
 */
const deleteServer = async (req, res) => {
  try {
    const deleted = await serverService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Server not found' });
    res.status(200).json({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Error deleting server:', error.message);
    res.status(500).json({ error: 'Failed to delete server' });
  }
};

module.exports = {
  getAllServers,
  getServerById,
  createServer,
  updateServer,
  deleteServer
};
