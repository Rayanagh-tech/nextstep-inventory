import { useEffect, useState } from 'react';
import {
  User as UserIcon, Shield, Bell, Cog, Database, Settings as SettingsIcon,Link,Rss,MonitorCog,
} from 'lucide-react';
import { getUserById, updateUser,  updatePassword, updateMfaSetting } from '@/services/userService';
import { useStore } from '@/store';
import { toast } from 'sonner'; // for optional feedback
import VsphereConnectionsTab from '@/components/VsphereConnectionsTab';

// Tabs definition
const tabs = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'system', name: 'System', icon: MonitorCog },
  { id: 'vSphere Connections', name: 'vSphere Connections', icon: Link },
  { id: 'SNMP Configuration', name: 'SNMP Configuration', icon: Rss },
];

const Settings = () => {

  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleMfaToggle = async (enabled: boolean) => {
    setMfaEnabled(enabled); // Optimistic update
  
    if (!storedUser?.id) {
      toast.error('⚠️ User not loaded');
      return;
    }
  
    try {
      await updateMfaSetting(storedUser.id, { mfa_enabled: enabled });
      toast.success(`✅ MFA ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error: any) {
      console.error('MFA update failed:', error);
      toast.error(error?.response?.data?.error || '❌ Failed to update MFA setting');
      setMfaEnabled((prev) => !prev); // Rollback on error
    }
  };
  
  const storedUser = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: storedUser?.username || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    department: storedUser?.department || '',
    jobTitle: storedUser?.job_title || '',
    role: storedUser?.role || '',
  });


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });


  // ✅ Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userData = await getUserById(userId);
          setUser(userData);
          setMfaEnabled(userData.mfa_enabled || false); // ✅ Load MFA status from DB

          setProfile({
            name: userData.username || '',
            email: userData.email || '',
            phone: userData.phone || '',
            department: userData.department || '',
            jobTitle: userData.job_title || '',
            role: userData.role || '',
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); // fetch only on first mount
  }, [setUser]);



  // ✅ Handle profile form changes
  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };


    // ✅ Save updated profile
  const handleSaveProfile = async () => {
    if (!storedUser) return;
    try {
      const updated = await updateUser(storedUser.id, {
        username: profile.name,
        email: profile.email,
        phone: profile.phone,
        department: profile.department,
        job_title: profile.jobTitle,
        role: profile.role,
      });
      setUser(updated);
      toast.success('✅ Profile updated successfully');
      localStorage.setItem('userId', updated.id); // if you use this
    } catch (err) {
      console.error('Update error:', err);
      toast.error('❌ Failed to update profile');
    }
  };

  
  // ✅ Change password handler
  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      toast.error('❗ Fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('❗ New passwords do not match.');
      return;
    }

    try {
      if (!storedUser?.id) {
        toast.error('User ID is missing.');
        return;
      }
      await updatePassword(storedUser.id, { currentPassword, newPassword });
      toast.success('✅ Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password update failed:', err);
      toast.error(err?.response?.data?.error || '❌ Failed to update password');
    }
  };



const handleNotificationChange = (channel: string, value: boolean) => {
  setNotifications((prev) => ({
    ...prev,
    [channel]: value,
  }));
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading user...
      </div>
    );
  }

  if (!storedUser) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        User not found.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="flex-1 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                   { label: 'Full Name', field: 'name', type: 'text'},
                   { label: 'Email Address', field: 'email', type: 'email'},
                   { label: 'Phone Number', field: 'phone', type: 'tel'},
                   { label: 'Department', field: 'department', type: 'text'},
                   { label: 'Job Title', field: 'jobTitle', type: 'text'},
                   { label: 'Role', field: 'role', type: 'text'},
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={profile[field as keyof typeof profile] || ''}
                      placeholder={profile[field as keyof typeof profile] || ''}
                      onChange={(e) => handleProfileChange(field, e.target.value)}
                      readOnly={field === 'role' && storedUser.role !== 'admin'}
                      disabled={field === 'role' && storedUser.role !== 'admin'}
                      className={`w-full px-4 py-2 border rounded-lg 
                        focus:ring-2 focus:ring-blue-500 
                        ${field === 'role' && storedUser.role !== 'admin' 
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400'}`}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

            {activeTab === 'security' && (
              <div className="flex-1 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Multi-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mfaEnabled}
                          onChange={(e) => handleMfaToggle(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Change Password</h3>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                            value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
  onClick={handlePasswordChange}
>
  Update Password
</button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex-1 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {key === 'sms' ? 'SMS' : key} Notifications
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive notifications via {key === 'sms' ? 'SMS' : key}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNotificationChange(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="flex-1 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Configuration</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Data Retention</h3>
                      <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option>30 days</option>
                        <option>60 days</option>
                        <option>90 days</option>
                        <option>1 year</option>
                      </select>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Default Timezone</h3>
                      <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option>UTC</option>
                        <option>Eastern Time</option>
                        <option>Central Time</option>
                        <option>Mountain Time</option>
                        <option>Pacific Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

{activeTab === 'vSphere Connections' && <VsphereConnectionsTab />}


{activeTab === 'SNMP Configuration' && (
  <div className="flex-1 p-6 space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">SNMP Configuration</h2>
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
      <input
        type="text"
        placeholder="Community String"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <input
        type="number"
        placeholder="Port (default: 161)"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
        Save SNMP Settings
      </button>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
  );
};

export default Settings;
