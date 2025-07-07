import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { testConnection, createConnection, updateConnection } from '@/services/vsphereService';
import { fetchTags } from '@/services/tagService';
import { toast } from 'sonner';

const VsphereConnectionsTab = () => {
  const { user, vsphereConnections, fetchVsphereConnections, deleteVsphereConnection, datacenters, fetchDatacenters } = useStore();
  const { users, fetchUsers } = useStore();
  const { tags, fetchTags } = useStore();

  const [testForm, setTestForm] = useState({
    datacenterId: '',
    api_username: user?.role === 'admin' ? '' : user?.username || '',
    api_password: '',
  });
  const [createForm, setCreateForm] = useState({
    datacenterId: '',
    api_username: user?.role === 'admin' ? '' : user?.username || '',
    api_password: '',
    api_version: '',
    tags: [],
    isAdmin: user?.role === 'admin',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    api_username: '',
    api_password: '',
    api_version: '',
    is_active: true,
    tags: [],
  });
  const [testResult, setTestResult] = useState<{ status: string; message: string } | null>(null);
  const [creating, setCreating] = useState(false);

  const handleTestChange = (field: string, value: string) => setTestForm((prev) => ({ ...prev, [field]: value }));
  const handleCreateChange = (field: string, value: string | number[]) => setCreateForm((prev) => ({ ...prev, [field]: value }));
  const handleEditChange = (field: string, value: string | boolean) => setEditForm((prev) => ({ ...prev, [field]: value }));

  const startEdit = (conn: any) => {
    setEditId(conn.id);
    setEditForm({
      api_username: conn.api_username,
      api_password: '',
      api_version: conn.api_version || '',
      is_active: conn.is_active ?? true,
      tags: conn.tags || [],
    });
  };

  const submitUpdate = async () => {
    if (!editId) return;
    try {
      await updateConnection(editId, editForm);
      toast.success('✅ Connection updated');
      setEditId(null);
      fetchVsphereConnections();
    } catch (err: any) {
      toast.error('❌ Failed to update connection');
    }
  };

  const handleTest = async () => {
    try {
      const datacenter = datacenters.find(dc => dc.id === testForm.datacenterId);
      const apiUrl = datacenter?.vcenter_api_url;
  
      if (!datacenter || !apiUrl) {
        toast.error('❌ Please select a valid datacenter with a vCenter API URL');
        return;
      }
  
      const result = await testConnection({
        vcenter_url: apiUrl, // ✅ updated to use vcenter_api_url
        api_username: testForm.api_username,
        api_password: testForm.api_password,
      });
  
      setTestResult(result);
      toast.success(`✅ ${result.message}`);
    } catch (err: any) {
      setTestResult({ status: 'error', message: err.response?.data?.error || '❌ Connection failed' });
      toast.error('❌ Connection test failed');
    }
  };
  
  

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    try {
      await createConnection({
        datacenter_id: createForm.datacenterId,
        api_username: createForm.api_username,
        api_password: createForm.api_password,
        api_version: createForm.api_version,
        tags: user.role === 'admin' ? createForm.tags : [],
      });
      toast.success('✅ vSphere connection created');
      fetchVsphereConnections();
    } catch (err: any) {
      toast.error(err.response?.data?.error || '❌ Failed to create connection');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
  
    const conn = vsphereConnections.find((c) => c.id === id);
    if (!conn) {
      toast.error('❌ Connection not found');
      return;
    }
  
    const isOwner = conn.api_username === user.username;
  
    // ✅ ALLOW if user is admin or connection owner
    if (user.role !== 'admin' && !isOwner) {
      toast.error('❌ Access denied');
      return;
    }
  
    try {
      await deleteVsphereConnection(id);
      toast.success('✅ Connection deleted');
      fetchVsphereConnections();
    } catch (err: any) {
      toast.error(err.response?.data?.error || '❌ Failed to delete connection');
    }
  };
  

  useEffect(() => {
    if (user) {
      fetchDatacenters();
      console.log('Datacenters loaded:', datacenters);
      fetchVsphereConnections();
      fetchTags();
      if (user.role === 'admin') {
        fetchUsers(); // 👈 fetch all users for admin
      }
    }
  }, [user, fetchDatacenters, fetchVsphereConnections, fetchTags]);

  return (
    <div className="flex-1 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">vSphere Connection</h2>


      {/* Test Connection Section */}
<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">🔌 Test Connection</h3>

  {/* Datacenter Select */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-700 dark:text-gray-300">Datacenter</label>
    <select
      value={testForm.datacenterId}
      onChange={(e) => handleTestChange('datacenterId', e.target.value)}
      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    >
      <option value="">Select Datacenter</option>
      {datacenters.map(dc => (
        <option key={dc.id} value={dc.id}>
          {dc.name} — {dc.location}
        </option>
      ))}
    </select>
  </div>

  {/* API Username */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-700 dark:text-gray-300">API Username</label>
    {user?.role === 'admin' ? (
  <select
    value={testForm.api_username}
    onChange={(e) => handleTestChange('api_username', e.target.value)}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Select API Username</option>
    {users.map((u) => (
      <option key={u.id} value={u.username}>
        {u.username}
      </option>
    ))}
  </select>
) : (
  <input
    type="text"
    value={testForm.api_username}
    readOnly
    className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white cursor-not-allowed"
  />
)}
  </div>

  {/* API Password */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-700 dark:text-gray-300">API Password</label>
    <input
      type="password"
      placeholder="••••••••"
      value={testForm.api_password}
      onChange={(e) => handleTestChange('api_password', e.target.value)}
      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    />
  </div>

  {/* Test Button */}
  <button
    onClick={handleTest}
    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg w-full font-semibold transition"
  >
    🔍 Test Connection
  </button>

  {/* Result Message */}
  {testResult && (
    <p className={`text-sm font-medium ${testResult.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
      {testResult.message}
    </p>
  )}
</div>



     {/* Create Connection Section */}
     <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">🛠️ Create Connection</h3>

      <select
    value={createForm.datacenterId}
    onChange={(e) => handleCreateChange('datacenterId', e.target.value)}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Select Datacenter</option>
    {datacenters.map((dc) => (
      <option key={dc.id} value={dc.id}>
        {dc.name} — {dc.location}
      </option>
    ))}
  </select>

  {user?.role === 'admin' ? (
  <select
    value={createForm.api_username}
    onChange={(e) => handleCreateChange('api_username', e.target.value)}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  >
    <option value="">Select User</option>
    {users.map((u) => (
      <option key={u.id} value={u.username}>
        {u.username}
      </option>
    ))}
  </select>
) : (
  <input
    type="text"
    value={createForm.api_username}
    readOnly
    className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white cursor-not-allowed"
  />
)}



  {/* API Password */}
  <input
    type="password"
    placeholder="API Password"
    value={createForm.api_password}
    onChange={(e) => handleCreateChange('api_password', e.target.value)}
    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  />

  {/* API Version */}
  <input
   type="text"
   placeholder="API Version (e.g. 7.0.3)"
   value={createForm.api_version}
   onChange={(e) => handleCreateChange('api_version', e.target.value)}
   className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
  />
{/* Admin-only: Tag Entry */}
{user?.role === 'admin' && (
  <div className="flex flex-col space-y-2">
    
    <select
      value={createForm.tags?.[0] !== undefined ? String(createForm.tags[0]) : ''}
      onChange={(e) => handleCreateChange('tags', [parseInt(e.target.value)])}
      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">🏷️ Select Tag</option>
      {tags.map((tag) => (
        <option key={tag.id} value={String(tag.id)}>
          {tag.name}{tag.type ? ` — ${tag.type}` : ''}
        </option>
      ))}
    </select>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Only one tag can be assigned per connection.
    </p>
  </div>
)}


  
  

  {/* Buttons */}
  <div className="flex space-x-4">
  <button
        onClick={handleCreate}
        disabled={
          creating ||
          !createForm.datacenterId ||
          !createForm.api_username ||
          !createForm.api_password
        }       
         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
      >
        {creating ? 'Creating...' : 'Create Connection'}
      </button>
    
  </div>
  {/* Result Message */}
  {testResult && (
    <p className={`text-sm ${testResult.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
      {testResult.message}
    </p>
  )}
</div>

      {/* Connections List */}
<div className="mt-6">
  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
    Existing Connections
  </h3>

  {vsphereConnections.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vsphereConnections.map((conn) => (
        <div
          key={conn.id}
          className="p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md space-y-2"
        >
          <div>
            <p className="text-gray-900 dark:text-white font-semibold">
              {conn.api_username}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last used: {conn.last_used ? new Date(conn.last_used).toLocaleString() : 'Never'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version: {conn.api_version || 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Datacenter: {conn.datacenter_name || 'Unknown'}
            </p>  
          
          </div>

          {editId === conn.id ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Username"
                value={editForm.api_username}
                onChange={(e) => handleEditChange('api_username', e.target.value)}
                className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={editForm.api_password}
                onChange={(e) => handleEditChange('api_password', e.target.value)}
                className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="API Version"
                value={editForm.api_version}
                onChange={(e) => handleEditChange('api_version', e.target.value)}
                className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:text-white"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={(e) => handleEditChange('is_active', e.target.checked)}
                />
                <span className="text-sm dark:text-white">Active</span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={submitUpdate}
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Submit
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                disabled={user?.role !== 'admin'}
                onClick={() => startEdit(conn)}
                className={`px-3 py-1 text-sm rounded ${
                  user?.role === 'admin'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                Update
              </button>
            {/* Delete Button */}
  <button
    disabled={
      user?.role !== 'admin' && user?.username !== conn.api_username
    }
    onClick={() => handleDelete(conn.id)}
    className={`px-3 py-1 text-sm rounded-md ${
      user?.role === 'admin' || user?.username === conn.api_username
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-gray-400 text-white cursor-not-allowed'
    }`}
  >
    Delete
  </button>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
      No vSphere connections found.
    </div>
  )}
</div>

    </div>
  );
};

export default VsphereConnectionsTab;
