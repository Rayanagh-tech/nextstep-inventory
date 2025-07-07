import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { Search, Plus, Edit, Eye, X, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';



// Extend allowed types locally to include empty string
type ScheduleTypeOption = '' | 'hourly' | 'daily' | 'weekly' | 'monthly';
type BackupTypeOption = '' | 'full' | 'incremental' | 'differential' | 'archive';


const BackupPolicies = () => {
  const user = useStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    policy_name: '',
    schedule_type: '' as ScheduleTypeOption,
    retention_days: '',
    datacenter_id: '',
    backup_type: '' as BackupTypeOption,
  });

  const {
    backupPolicies,
    fetchBackupPolicies,
    createBackupPolicy,
    deleteBackupPolicy,
    datacenters,
    fetchDatacenters
  } = useStore();

  useEffect(() => {
    fetchBackupPolicies();
    fetchDatacenters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this policy?')) return;
    try {
      await deleteBackupPolicy(id);
      await fetchBackupPolicies();
    } catch (err) {
      console.error('❌ Failed to delete', err);
      toast('❌ Could not delete policy');
    }
  };

  const handleCreate = async () => {
    if (
      !newPolicy.policy_name ||
      !newPolicy.schedule_type ||
      !newPolicy.retention_days ||
      !newPolicy.backup_type ||
      !newPolicy.datacenter_id
    ) {
      toast('Please fill in all fields.');
      return;
    }

    try {
      await createBackupPolicy({
        datacenter_id: newPolicy.datacenter_id,
        policy_name: newPolicy.policy_name,
        schedule_type: newPolicy.schedule_type as Exclude<ScheduleTypeOption, ''>,
        retention_days: Number(newPolicy.retention_days),
        backup_type: newPolicy.backup_type as Exclude<BackupTypeOption, ''>,
      });

      await fetchBackupPolicies();
      setIsCreateOpen(false);
      setNewPolicy({
        policy_name: '',
        schedule_type: '',
        retention_days: '',
        datacenter_id: '',
        backup_type: '',
      });
      toast.success('✅ Backup policy created successfully');
    } catch (error) {
      console.error('❌ Failed to create policy', error);
      toast('❌ Failed to create policy');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'incremental': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'differential': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'archive': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredPolicies = backupPolicies.filter((policy) =>
    policy.policy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.schedule_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.backup_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Backup Policies</h1>
        {user?.role === 'admin' && (
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Policy</span>
        </button>
      )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search backup policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPolicies.map(policy => (
          <div key={policy.id} className="bg-white dark:bg-gray-800 border rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{policy.policy_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{policy.backup_type}</p>
              </div>
              <div className="space-x-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(policy.backup_type)}`}>
                  {policy.schedule_type}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(policy.status)}`}>
                  {policy.status}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>Retention: {policy.retention_days} days</p>
              <p>Last Run: {policy.last_run ? new Date(policy.last_run).toLocaleString() : 'N/A'}</p>
              <p>Next Run: {policy.next_run ? new Date(policy.next_run).toLocaleString() : 'N/A'}</p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-500 hover:text-green-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(policy.id)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                Run Now
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Backup Policy</h2>
            <input
              type="text"
              placeholder="Policy Name"
              value={newPolicy.policy_name}
              onChange={(e) => setNewPolicy({ ...newPolicy, policy_name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            />
            <select
              value={newPolicy.schedule_type}
              onChange={(e) =>
                setNewPolicy({ ...newPolicy, schedule_type: e.target.value as 'hourly' | 'daily' | 'weekly' | 'monthly' })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Schedule Type</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <input
              type="number"
              placeholder="Retention Days"
              value={newPolicy.retention_days}
              onChange={(e) => setNewPolicy({ ...newPolicy, retention_days: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            />
            <select
              value={newPolicy.backup_type}
              onChange={(e) =>
                setNewPolicy({ ...newPolicy, backup_type: e.target.value as 'full' | 'incremental' | 'differential' | 'archive' })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Backup Type</option>
              <option value="full">Full</option>
              <option value="incremental">Incremental</option>
              <option value="differential">Differential</option>
              <option value="archive">Archive</option>
            </select>
            <select
              value={newPolicy.datacenter_id}
              onChange={(e) => setNewPolicy({ ...newPolicy, datacenter_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Datacenter</option>
              {datacenters.map(dc => (
                <option key={dc.id} value={dc.id}>{dc.name}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg">Cancel</button>
              <button type="button" onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupPolicies;
