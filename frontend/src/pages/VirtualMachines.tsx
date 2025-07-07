import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Eye, X } from 'lucide-react';
import { useStore } from '@/store';
import { getAllDatacenters } from '@/services/datacenterService';
import { getAllConnections } from '@/services/vsphereService';
import type { Vm } from '@/types/entities/Vm';
import type { Datacenter } from '@/types/entities/Datacenter';
import type { VsphereConnection } from '@/types/entities/VsphereConnection';
import { toast } from 'sonner';
import { getAllServers } from '@/services/serverService'; // if not yet created, I can help
import type { Server } from '@/types/entities/Server';
import { getAllTags } from '@/services/tagService';
import { getAllUsers } from '@/services/userService';
import { getAllVms } from '@/services/vmService';
import { Tag } from '@/types/store';



const defaultVm: Partial<Vm> = {
  name: '',
  vsphere_id: '',
  datacenter_id: '',
  power_state: 'poweredOff',
  os_type: '',
  os_version: '',
  tools_status: '',
  tools_version: '',
  guest_hostname: '',
  memory_gb: 0,
  storage_gb: 0,
  vcpu_count: 0,
  ip_address: [],
  last_backup: '',
  backup_status: '',
  owner_email: '',
  business_unit: '',
  criticality: undefined,
  tags: [],
  vsphere_attributes: {},
};


const osOptions = ['Ubuntu', 'Windows Server', 'RedHat', 'Linux', 'Debian', 'CentOS'];
const criticalityOptions = ['low', 'medium', 'high', 'critical'];
const backupStatusOptions = ['completed', 'in-progress', 'failed'];
const toolsStatusOptions = ['running', 'notRunning', 'unknown'];
const businessUnitOptions = ['IT', 'Finance', 'HR', 'Engineering'];
const osVersions = ['20.04', '22.04', '2022', '2019'];


const VirtualMachines = () => {
  const user = useStore.getState().user;
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Vm>>(defaultVm);
  const [vspheres, setVspheres] = useState<VsphereConnection[]>([]);
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [servers, setServers] = useState<Server[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [emailsList, setEmailsList] = useState<string[]>([]);
  const [hostnamesList, setHostnamesList] = useState<string[]>([]);
  const [usernamesList, setUsernamesList] = useState<string[]>([]);


  const { vms, fetchVms, createVm, updateVm, deleteVm } = useStore();

  useEffect(() => {
    fetchVms();
    getAllConnections().then(setVspheres);
    getAllDatacenters().then(setDatacenters);
    getAllServers().then(setServers);
    getAllTags().then(setAllTags).catch(() => toast.error('Failed to load tags'));
    getAllUsers().then((users) => {
      setEmailsList(users.map((user) => user.email));
      setUsernamesList(users.map((user) => user.username));
    });
    getAllVms().then((vms) =>
      setHostnamesList(
        vms
          .map((vm) => vm.guest_hostname)
          .filter((hostname): hostname is string => typeof hostname === 'string')
      )
    );
  }, []);

  const getOptions = (values: string[], placeholder: string, selected: string | undefined, onChange: (v: string) => void) => (
    <select value={selected || ''} onChange={(e) => onChange(e.target.value)} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
      <option value="">{placeholder}</option>
      {values.map((val) => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  );

  const getEmailSelect = () => {
    if (user?.role === 'admin') {
      if (!formData.datacenter_id) {
        return (
          <select disabled className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
            <option>Select a Datacenter first</option>
          </select>
        );
      }
  
      const filteredEmails = vspheres
        .filter((v) => v.datacenter_id === formData.datacenter_id)
        .map((v) => {
          const i = usernamesList.findIndex((u) => u === v.api_username);
          return i !== -1 ? emailsList[i] : undefined;
        })
        .filter((email): email is string => !!email);
  
      const uniqueEmails = Array.from(new Set(filteredEmails));
  
      return (
        <select
          value={formData.owner_email || ''}
          onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
          className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select Owner Email</option>
          {uniqueEmails.length > 0 ? (
            uniqueEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))
          ) : (
            <option disabled>No matching emails found</option>
          )}
        </select>
      );
    }
  
    // For regular users
    return (
      <input
        type="email"
        value={user?.email || ''}
        disabled
        className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
      />
    );
  };
  
    const getHostnameSelect = () =>
      user?.role === 'admin'
        ? (
          <select
            value={formData.guest_hostname || ''}
            onChange={(e) => setFormData({ ...formData, guest_hostname: e.target.value })}
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Guest Hostname</option>
            {usernamesList.map((username) => (
              <option key={username} value={username}>{username}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={user?.username || ''}
            disabled
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        );
        const getTagsSelect = () => {
          const selectedTags = formData.tags || [];
        
          return (
            <select
            
              value={selectedTags}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
              className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Tags</option>
              {allTags.length > 0 ? (
                allTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))
              ) : (
                <option disabled>No tags available</option>
              )}
            </select>
          );
        };
        

  const filteredVMs = vms.filter((vm) =>
    vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vm.os_type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const uniqueUsernames = Array.from(new Set(vspheres.map((v) => v.api_username)));

  const filteredDatacenters = vspheres
    .filter((v) => v.api_username === selectedUser)
    .map((v) => {
      const dc = datacenters.find((d) => d.id === v.datacenter_id);
      return dc ? { ...dc, vsphere_id: v.id } : null;
    })
    .filter((d): d is Datacenter & { vsphere_id: string } => d !== null);

const filteredServers = servers.filter(
  (server) => server.datacenter_id === formData.datacenter_id
);

  const openCreateModal = () => {
    setFormData(defaultVm);
    setEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (vm: Vm) => {
    setFormData(vm);
    setSelectedUser(
      vspheres.find((v) => v.id === vm.vsphere_id)?.api_username || ''
    );
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const {
        name,
        vsphere_id,
        datacenter_id,
        server_id,
        os_type,
        memory_gb,
        storage_gb,
        vcpu_count,
        owner_email,
        guest_hostname,
        tags

      } = formData;
  
      // ✅ Validate all required fields before submission
      if (
        !name ||
        !vsphere_id ||
        !datacenter_id ||
        !server_id ||
        !os_type ||
        memory_gb === undefined ||
        storage_gb === undefined ||
        vcpu_count === undefined ||
        !owner_email ||
        !guest_hostname ||
        !tags
      ) {
        toast.error('Please fill in all required fields.');
        return;
      }
  
      if (editMode && formData.id) {
        await updateVm(formData.id, formData);
        toast.success('Virtual machine updated successfully.');
      } else {
        await createVm(formData);
        toast.success('Virtual machine created successfully.');
      }
  
      setShowModal(false);
      fetchVms();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error || error?.message || 'Failed to save virtual machine.';
      toast.error(errMsg);
    }
  };

  const getDatacenterName = (id?: string | null): string => {
    if (!id) return '—';
    return datacenters.find((dc) => dc.id === id)?.name || '—';
  };
  
  const getVsphereName = (id?: string | null): string => {
    if (!id) return '—';
    return vspheres.find((v) => v.id === id)?.api_username || '—';
  };
  
  
  
  

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'poweredOn':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'poweredOff':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Virtual Machines</h1>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create VM</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search virtual machines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredVMs.map((vm) => (
    <div key={vm.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{vm.name}</h2>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vm.power_state)}`}>
          {vm.power_state}
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-300">vSphere User: {getVsphereName(vm.vsphere_id)}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
  Datacenter: {getDatacenterName(vm.datacenter_id)}
</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">vCPU: {vm.vcpu_count ?? '—'}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">Memory: {vm.memory_gb} GB</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">Storage: {vm.storage_gb} GB</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">OS: {vm.os_type}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">IP: {(vm.ip_address || []).join(', ') || '—'}</p>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => alert(JSON.stringify(vm, null, 2))} // Replace with actual modal/view logic
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          title="View"
        >
          <Eye className="w-4 h-4 mr-1" /> 
        </button>

        <button
          onClick={() => openEditModal(vm)}
          className="flex items-center text-green-600 dark:text-green-400 hover:underline"
          title="Edit"
        >
          <Edit className="w-4 h-4 mr-1" /> 
        </button>

        <button
          onClick={() => deleteVm(vm.id)}
          className="flex items-center text-red-600 dark:text-red-400 hover:underline"
          title="Delete"
        >
          <X className="w-4 h-4 mr-1" /> 
        </button>
      </div>
    </div>
  ))}
</div>
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-3xl space-y-6 overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {editMode ? 'Edit VM' : 'Create VM'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="VM Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />

        <select value={selectedUser} onChange={(e) => { setSelectedUser(e.target.value); setFormData({ ...formData, datacenter_id: '', vsphere_id: '', server_id: '' }); }} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Select vSphere User</option>
          {uniqueUsernames.map((username) => (<option key={username} value={username}>{username}</option>))}
        </select>

        <select value={formData.datacenter_id || ''} onChange={(e) => { const dcId = e.target.value; const match = filteredDatacenters.find((dc) => dc.id === dcId); setFormData({ ...formData, datacenter_id: dcId, vsphere_id: match?.vsphere_id ?? '', server_id: '' }); }} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" disabled={!selectedUser}>
          <option value="">Select Datacenter</option>
          {filteredDatacenters.map((dc) => (<option key={dc.id} value={dc.id}>{dc.name}</option>))}
        </select>

        <select value={formData.server_id || ''} onChange={(e) => setFormData({ ...formData, server_id: e.target.value })} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" disabled={!formData.datacenter_id}>
          <option value="">Select Server</option>
          {filteredServers.map((server) => (<option key={server.id} value={server.id}>{server.name} ({server.ip_address})</option>))}
        </select>

        <select value={formData.os_type || ''} onChange={(e) => setFormData({ ...formData, os_type: e.target.value })} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Select OS Type</option>
          {osOptions.map((os) => (<option key={os} value={os}>{os}</option>))}
        </select>

        <input type="text" placeholder="OS Version" value={formData.os_version || ''} onChange={(e) => setFormData({ ...formData, os_version: e.target.value })} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />

        {getHostnameSelect()}

        <input type="text" placeholder="IP Address" value={(formData.ip_address || []).join(', ')} onChange={(e) => setFormData({ ...formData, ip_address: e.target.value.split(',').map(ip => ip.trim()) })} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />

        <select
  value={formData.power_state || ''}
  onChange={(e) =>
    setFormData({
      ...formData,
      power_state: e.target.value as Vm['power_state'], // ✅ fix
    })
  }
  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
>
  <option value="">Select Power State</option>
  {['poweredOn', 'poweredOff', 'suspended', 'unknown'].map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>


<select
  value={formData.tools_status || ''}
  onChange={(e) => setFormData({ ...formData, tools_status: e.target.value })}
  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
>
  <option value="">Select Tools Status</option>
  {toolsStatusOptions.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ))}
</select>

<select
  value={formData.tools_version || ''}
  onChange={(e) => setFormData({ ...formData, tools_version: e.target.value })}
  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
>
  <option value="">Select Tools Version</option>
  {osVersions.map((version) => (
    <option key={version} value={version}>
      {version}
    </option>
  ))}
</select>

<select
  value={formData.backup_status || ''}
  onChange={(e) => setFormData({ ...formData, backup_status: e.target.value })}
  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
>
  <option value="">Select Backup Status</option>
  {backupStatusOptions.map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>

        {getEmailSelect()}

        <select
  value={formData.business_unit || ''}
  onChange={(e) => setFormData({ ...formData, business_unit: e.target.value })}
  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
>
  <option value="">Select Business Unit</option>
  {businessUnitOptions.map((unit) => (
    <option key={unit} value={unit}>
      {unit}
    </option>
  ))}
</select>

        <select value={formData.criticality ?? ''} onChange={(e) => setFormData({ ...formData, criticality: e.target.value as Vm['criticality'] })} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Select Criticality</option>
          {criticalityOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
        </select>

        {getTagsSelect()}

      </div>

      <div className="pt-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">vCPU Count</label>
            <input type="number" min={1} value={formData.vcpu_count ?? ''} onChange={(e) => setFormData({ ...formData, vcpu_count: +e.target.value })} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Memory (GB)</label>
            <input type="number" min={1} value={formData.memory_gb ?? ''} onChange={(e) => setFormData({ ...formData, memory_gb: +e.target.value })} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Storage (GB)</label>
            <input type="number" min={1} value={formData.storage_gb ?? ''} onChange={(e) => setFormData({ ...formData, storage_gb: +e.target.value })} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          {editMode ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default VirtualMachines;