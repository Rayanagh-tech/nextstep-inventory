import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, X } from 'lucide-react';
import { useStore } from '@/store';
import type {
  BayType,
  StorageBay,
  StorageStatus,
  StorageType,
  ProtocolType,
} from '@/types/entities/StorageBay';
import { toast } from 'sonner';
import { deleteStorageBay } from '@/services/storageBaysService';


const StorageBays = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editModeBay, setEditModeBay] = useState<StorageBay | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    type?: BayType;
    protocol?: ProtocolType;
    total_capacity_gb: string;
    used_capacity_gb: string;
    storage_type?: StorageType;
    status?: StorageStatus;
    datacenter_id: string;
  }>({
    name: '',
    type: undefined,
    protocol: undefined,
    total_capacity_gb: '',
    used_capacity_gb: '',
    storage_type: undefined,
    status: undefined,
    datacenter_id: '',
  });
  
  const { user, storageBays, fetchStorageBays, createStorageBay, datacenters, fetchDatacenters } = useStore();

  useEffect(() => {
    fetchStorageBays();
    fetchDatacenters();
  }, [fetchStorageBays]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getUsagePercentage = (used: string | number, total: string | number) => {
    const usedNum = Number(used);
    const totalNum = Number(total);
    return totalNum > 0 ? Math.round((usedNum / totalNum) * 100) : 0;
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this storage bay?");
    if (!confirm) return;
  
    try {
      await deleteStorageBay(id); // from Zustand store
      toast.success("Storage bay deleted successfully ✅");
      fetchStorageBays(); // refresh list
    } catch (error) {
      console.error("❌ Failed to delete storage bay:", error);
      toast.error("Failed to delete storage bay.");
    }
  };
  

  const handleCreate = async () => {
    // Simple validation check
    if (
      !formData.name ||
      !formData.type ||
      !formData.protocol ||
      !formData.total_capacity_gb ||
      !formData.used_capacity_gb ||
      !formData.storage_type ||
      !formData.status ||
      !formData.datacenter_id
    ) {
      toast.error('Please fill all fields before submitting.');
      return;
    }
  
    try {
      const used = Number(formData.used_capacity_gb);
      const total = Number(formData.total_capacity_gb);
      const free = total - used;
  
      await createStorageBay({
        name: formData.name,
        type: formData.type,
        protocol: formData.protocol,
        storage_type: formData.storage_type,
        status: formData.status,
        datacenter_id: formData.datacenter_id,
        used_capacity_gb: used.toString(),
        total_capacity_gb: total.toString(),
        free_capacity_gb: free.toString(),
        tags: ['manual'],
      });

      toast.success('Storage bay created successfully ✅');

  
      setShowModal(false);
      setFormData({
        name: '',
        type: undefined,
        protocol: undefined,
        total_capacity_gb: '',
        used_capacity_gb: '',
        storage_type: undefined,
        status: undefined,
        datacenter_id: '',
      });
      await fetchStorageBays();
    } catch (error: any) {
      console.error('❌ Failed to create storage bay:', error);
      toast.error(
        error?.response?.status === 403
          ? 'You are not authorized.'
          : 'Failed to create storage bay.'
      );    }
  };
  
  const handleEditClick = (bay: StorageBay) => {
    setEditModeBay(bay);
    setFormData({
      name: bay.name,
      type: bay.type,
      protocol: bay.protocol,
      total_capacity_gb: bay.total_capacity_gb.toString(),
      used_capacity_gb: bay.used_capacity_gb.toString(),
      storage_type: bay.storage_type,
      status: bay.status,
      datacenter_id: bay.datacenter_id,
    });
    setShowModal(true);
  };
  
  const handleUpdate = async () => {
    if (
      !formData.name ||
      !formData.type ||
      !formData.protocol ||
      !formData.total_capacity_gb ||
      !formData.used_capacity_gb ||
      !formData.storage_type ||
      !formData.status ||
      !formData.datacenter_id
    ) {
      toast.error('Please fill all fields before updating.');
      return;
    }
  
    try {
      const used = Number(formData.used_capacity_gb);
      const total = Number(formData.total_capacity_gb);
      const free = total - used;
  
      await createStorageBay({
        id: editModeBay?.id, // Use the existing ID for update
        name: formData.name,
        type: formData.type,
        protocol: formData.protocol,
        storage_type: formData.storage_type,
        status: formData.status,
        datacenter_id: formData.datacenter_id,
        used_capacity_gb: used.toString(),
        total_capacity_gb: total.toString(),
        free_capacity_gb: free.toString(),
        tags: ['manual'],
      });
  
      toast.success('Storage bay updated successfully ✅');
      setShowModal(false);
      setEditModeBay(null);
      setFormData({
        name: '',
        type: undefined,
        protocol: undefined,
        total_capacity_gb: '',
        used_capacity_gb: '',
        storage_type: undefined,
        status: undefined,
        datacenter_id: '',
      });
      await fetchStorageBays();
    } catch (error) {
      console.error('❌ Failed to update storage bay:', error);
      toast.error('Failed to update storage bay.');
    }
  };
  
  

  const filteredStorageBays = storageBays.filter((bay) =>
    bay.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bay.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bay.storage_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 min-h-full overflow-x-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Storage Bays</h1>
        {user?.role === 'admin' && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Storage</span>
        </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search storage bays..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 w-full border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    />
  </div>
</div>


      {/* Table */}
    {/* Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredStorageBays.map((bay) => {
    const usagePercent = getUsagePercentage(bay.used_capacity_gb, bay.total_capacity_gb);

    return (
      <div
        key={bay.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700 space-y-3"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{bay.name}</h2>
          <div className="flex space-x-2">
            {user?.role === 'admin' && (
              <>
<button onClick={() => handleEditClick(bay)} className="text-green-600">
  <Edit className="w-4 h-4" />
</button>
                <button onClick={() => handleDelete(bay.id)} className="text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p><strong>Type:</strong> {bay.type}</p>
          <p><strong>Protocol:</strong> {bay.protocol}</p>
          <p><strong>Storage:</strong> {bay.storage_type}</p>
          <p>
  <strong>Datacenter:</strong>{' '}
  {
    datacenters.find(dc => dc.id === bay.datacenter_id)?.name || 'Unknown'
  }
</p>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p><strong>Total:</strong> {Number(bay.total_capacity_gb).toLocaleString()} GB</p>
          <p><strong>Used:</strong> {Number(bay.used_capacity_gb).toLocaleString()} GB</p>
          <p><strong>Free:</strong> {Number(bay.free_capacity_gb).toLocaleString()} GB</p>
        </div>

        <div>
          <p className="text-xs mb-1 text-gray-600 dark:text-gray-400">Usage</p>
          <div className="flex items-center">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mr-2">
              <div
                className={`h-2 rounded-full ${
                  usagePercent > 80
                    ? 'bg-red-500'
                    : usagePercent > 60
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <span className="text-sm text-white">{usagePercent}%</span>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bay.status)}`}
          >
            {bay.status}
          </span>
        </div>
      </div>
    );
  })}

  {filteredStorageBays.length === 0 && (
    <div className="col-span-full text-center text-gray-500 py-8">
      No storage bays found.
    </div>
  )}
</div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xl space-y-4">
          <h2 className="text-xl font-semibold">
  {editModeBay ? 'Edit Storage Bay' : 'Add Storage Bay'}
</h2>
            <div className="grid grid-cols-2 gap-4">
  <input
    type="text"
    placeholder="Name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  />

  <select
    value={formData.type}
    onChange={(e) => setFormData({ ...formData, type: e.target.value as BayType })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Type</option>
    <option value="SAN">SAN</option>
    <option value="NAS">NAS</option>
    <option value="DAS">DAS</option>
    <option value="vSAN">vSAN</option>
    <option value="NFS">NFS</option>
    <option value="VMFS">VMFS</option>
  </select>

  <select
    value={formData.protocol}
    onChange={(e) => setFormData({ ...formData, protocol: e.target.value as ProtocolType })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Protocol</option>
    <option value="iSCSI">iSCSI</option>
    <option value="FC">FC</option>
    <option value="NFS">NFS</option>
    <option value="SMB">SMB</option>
    <option value="FCoE">FCoE</option>
  </select>

  <input
    type="number"
    placeholder="Total Capacity (GB)"
    value={formData.total_capacity_gb}
    onChange={(e) => setFormData({ ...formData, total_capacity_gb: e.target.value })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  />

  <input
    type="number"
    placeholder="Used Capacity (GB)"
    value={formData.used_capacity_gb}
    onChange={(e) => setFormData({ ...formData, used_capacity_gb: e.target.value })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  />

  <select
    value={formData.storage_type}
    onChange={(e) => setFormData({ ...formData, storage_type: e.target.value as StorageType })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Storage Type</option>
    <option value="SSD">SSD</option>
    <option value="HDD">HDD</option>
    <option value="hybrid">hybrid</option>
    <option value="NVMe">NVMe</option>
  </select>

  <select
    value={formData.status}
    onChange={(e) => setFormData({ ...formData, status: e.target.value as StorageStatus })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Status</option>
    <option value="active">Active</option>
    <option value="degraded">Degraded</option>
    <option value="maintenance">Maintenance</option>
    <option value="offline">Offline</option>
  </select>

  <select
    value={formData.datacenter_id}
    onChange={(e) => setFormData({ ...formData, datacenter_id: e.target.value })}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Datacenter</option>
    {datacenters.map((dc) => (
      <option key={dc.id} value={dc.id}>
        {dc.name}
      </option>
    ))}
  </select>
</div>


            <div className="flex justify-end space-x-2">
            <button
  onClick={() => {
    setShowModal(false);
    setEditModeBay(null);
  }}
  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
>
  Cancel
</button>
              <button
  onClick={editModeBay ? handleUpdate : handleCreate}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  {editModeBay ? 'Update' : 'Create'}
</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageBays;