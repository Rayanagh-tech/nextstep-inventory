import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Eye, X } from 'lucide-react';
import { useStore } from '@/store';
import type { Server } from '@/types/entities/Server';
import { toast } from 'sonner'; // for optional feedback


const emptyServer: Partial<Server> = {
  hostname: '',
  ip_address: '',
  datacenter_id: '',
  status: 'online',
  model: '',
  cpu_model: '',
  cpu_speed_ghz: undefined,
  total_ram_gb: undefined,
  installed_ram_gb: undefined,
  tags: [],
};



const Servers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Server>>(emptyServer);
  const user = useStore((state) => state.user);
const isAdmin = user?.role === 'admin';

  const servers = useStore((state) => state.servers);
  const datacenters = useStore((state) => state.datacenters);
  const fetchServers = useStore((state) => state.fetchServers);
  const fetchDatacenters = useStore((state) => state.fetchDatacenters);
  const createServer = useStore((state) => state.createServer);
  const updateServer = useStore((state) => state.updateServer);
  const deleteServer = useStore((state) => state.deleteServer);

  useEffect(() => {
    fetchServers();
    fetchDatacenters();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setForm(emptyServer);
    setIsModalOpen(true);
  };

  const openEditModal = (server: Server) => {
    setEditMode(true);
    setForm(server);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.hostname || !form.ip_address || !form.datacenter_id) {
      toast.error('Hostname, IP address, and datacenter are required');
      return;
    }

    try {
      if (editMode && form.id) {
        await updateServer(form.id, form);
      } else {
        await createServer(form);
      }
      setIsModalOpen(false);
      setForm(emptyServer);
      toast.success('Server saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save server');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this server?')) {
      await deleteServer(id);
      toast.success('Server deleted successfully');
    }
  };

  const getDatacenterName = (id: string) =>
    datacenters.find((dc) => dc.id === id)?.name || 'Unknown';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'decommissioned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'; // light blue
      case 'disconnected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  

  const filteredServers = servers.filter((server) =>
    server.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDatacenterName(server.datacenter_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Servers</h1>
        {isAdmin && (
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Server</span>
        </button>
      )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Server Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServers.map((server) => (
          <div key={server.id} className="bg-white dark:bg-gray-800 rounded-xl border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{server.hostname}</h2>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(server.status)}`}>
                {server.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>IP:</strong> {server.ip_address}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Datacenter:</strong> {getDatacenterName(server.datacenter_id)}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
            <button
          onClick={() => alert(JSON.stringify(server, null, 2))} // Replace with actual modal/view logic
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          title="View"
        >
          <Eye className="w-4 h-4 mr-1" /> 
        </button>
              {isAdmin && (
              <button
                onClick={() => openEditModal(server)}
                className="text-green-600 dark:text-green-400 p-1 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              )}
              {isAdmin && (
              <button
                onClick={() => handleDelete(server.id)}
                className="text-red-600 dark:text-red-400 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
<div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg space-y-4">
<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editMode ? 'Edit Server' : 'Add Server'}
            </h2>

            <input
              type="text"
              placeholder="Hostname"
              value={form.hostname}
              onChange={(e) => setForm({ ...form, hostname: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <input
              type="text"
              placeholder="IP Address"
              value={form.ip_address}
              onChange={(e) => setForm({ ...form, ip_address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            

            <select
              value={form.datacenter_id}
              onChange={(e) => setForm({ ...form, datacenter_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select Datacenter</option>
              {datacenters.map((dc) => (
                <option key={dc.id} value={dc.id}>
                  {dc.name}
                </option>
              ))}
            </select>
            

            <select
  value={form.status}
  onChange={(e) => setForm({ ...form, status: e.target.value as Server['status'] })}
  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>
  <option value="">Select Status</option>
  <option value="active">Active</option>
  <option value="maintenance">Maintenance</option>
  <option value="decommissioned">Decommissioned</option>
  <option value="disconnected">Disconnected</option>
</select>


            <select
  value={form.model}
  onChange={(e) => setForm({ ...form, model: e.target.value })}
  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>
  <option value="">Select Server Model</option>
  <option value="Dell PowerEdge R740">Dell PowerEdge R740</option>
  <option value="HP ProLiant DL380 Gen10">HP ProLiant DL380 Gen10</option>
  <option value="Lenovo ThinkSystem SR650">Lenovo ThinkSystem SR650</option>
  <option value="Cisco UCS C240 M5">Cisco UCS C240 M5</option>
  <option value="Supermicro SYS-1029P">Supermicro SYS-1029P</option>
</select>


<select
  value={form.cpu_model}
  onChange={(e) => setForm({ ...form, cpu_model: e.target.value })}
  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>
  <option value="">Select CPU Model</option>
  <option value="Intel Xeon Silver 4210">Intel Xeon Silver 4210</option>
  <option value="Intel Xeon Gold 6248">Intel Xeon Gold 6248</option>
  <option value="AMD EPYC 7702P">AMD EPYC 7702P</option>
  <option value="Intel Xeon E5-2670 v3">Intel Xeon E5-2670 v3</option>
  <option value="Intel Xeon Scalable 4316">Intel Xeon Scalable 4316</option>
</select>


            <input
              type="number"
              placeholder="CPU Speed (GHz)"
              value={form.cpu_speed_ghz ?? ''}
              onChange={(e) => setForm({ ...form, cpu_speed_ghz: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <input
              type="number"
              placeholder="Total RAM (GB)"
              value={form.total_ram_gb ?? ''}
              onChange={(e) => setForm({ ...form, total_ram_gb: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <input
              type="number"
              placeholder="Installed RAM (GB)"
              value={form.installed_ram_gb ?? ''}
              onChange={(e) => setForm({ ...form, installed_ram_gb: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editMode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servers;
