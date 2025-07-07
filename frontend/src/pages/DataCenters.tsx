import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { Plus, Edit, Eye, X, Database, Activity, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { Datacenter } from '@/types/entities/Datacenter';

const DataCenters = () => {
  const user = useStore((state) => state.user);
  const {
    datacenters,
    fetchDatacenters,
    deleteDatacenter,
    createDatacenter,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    timezone: '',
    vcenter_api_url: '',
  });

  useEffect(() => {
    fetchDatacenters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createDatacenter(form);
      toast.success('✅ Datacenter created');
      setForm({ name: '', location: '', description: '', timezone: '', vcenter_api_url: '' });
      setIsCreateOpen(false);
      fetchDatacenters();
    } catch (err) {
      toast.error('❌ Failed to create datacenter');
    }
  };

  const filteredDatacenters = datacenters.filter((dc) =>
    dc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dc.location.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDatacenter(id);
      toast.success('✅ Datacenter deleted');
    } catch (err) {
      toast.error('❌ Failed to delete datacenter');
    }
  };

  const handleEdit = (dc: Datacenter) => {
    console.log('📝 Edit datacenter:', dc);
    // You can open a modal and prefill with `dc`
  };

  const handleView = (dc: Datacenter) => {
    console.log('👁️ View datacenter:', dc);
    // You can open a modal or navigate to a view page
  };



  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Datacenters</h1>
      {user?.role === 'admin' && (
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          <Plus className="w-4 h-4 inline-block mr-1" /> Create Datacenter
        </button>
      )}
    </div>

      {/* 🔍 Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search datacenters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* 📦 Datacenter Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDatacenters.map((dc) => (
          <div key={dc.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dc.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{dc.location}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dc.last_sync_status ?? 'Online')}`}>
                {dc.last_sync_status ?? 'Online'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">vCenter URL</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{dc.vcenter_api_url}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Timezone</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{dc.timezone || 'UTC'}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">{dc.description || 'No description'}</div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleView(dc)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(dc)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(dc.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}


        {/* ➕ Create Datacenter Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Datacenter</h2>

            {['name', 'location', 'description'].map((field) => (
  <input
    key={field}
    name={field}
    value={form[field as keyof typeof form]}
    onChange={handleChange}
    placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
  />
))}

{/* Select dropdown for timezone */}

<select
  name="timezone"
  value={form.timezone}
  onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>
  <option value="">Select Timezone</option>
  {[
    'UTC',
    'Europe/Paris',
    'Africa/Tunis',
    'America/New_York',
    'Asia/Tokyo',
    'Asia/Kolkata',
    'Australia/Sydney'
  ].map((tz) => (
    <option key={tz} value={tz}>
      {tz}
    </option>
  ))}
</select>

{/* Special input for vCenter URL with https:// prefix */}
<div className="relative">
  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
    https://
  </span>
  <input
    type="text"
    name="vcenter_api_url"
    value={form.vcenter_api_url.replace(/^https?:\/\//, '')}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        vcenter_api_url: 'https://' + e.target.value.replace(/^https?:\/\//, ''),
      }))
    }
    placeholder="your-vcenter.domain.com"
    className="w-full pl-[72px] pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
  />
</div>


            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded border border-gray-400 text-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DataCenters;
