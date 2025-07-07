import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Eye, X, User, Shield } from 'lucide-react';
import { useStore } from '@/store';
import type { User as UserType } from '@/types/entities/User';
import { toast } from 'sonner';
import { deleteUser } from '@/services/userService';
import { useNavigate } from 'react-router-dom';


const Users = () => {
  const navigate = useNavigate();
  const { users, fetchUsers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers().catch((err) => {
      toast.error('Failed to fetch users');
      console.error(err);
    });
  }, []);

  
  

  const handleViewUser = (user: UserType) => {
    navigate(`/users/${user.id}/view`, { state: { user } });
  };

  const handleEditUser = (user: UserType) => {
    navigate(`/users/${user.id}/edit`, { state: { user } });
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
        await fetchUsers(); // refresh UI
      } catch (err) {
        toast.error('Failed to delete user');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRoleColor = (role: string) => {
    if (role === 'admin') {
      return 'bg-[#ff33f0] text-white dark:bg-[#ff33f0] dark:text-white';
    }
    return 'bg-[#3386ff] text-white';
  };
  

  const formatLastLogin = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      

      {/* Search by Username */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search by username..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    />
  </div>
</div>


      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user: UserType) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#3386ff] dark:bg-blue-900 rounded-lg">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  getStatusColor(user.mfa_enabled ? 'active' : 'inactive')
                }`}
              >
                {user.mfa_enabled ? 'MFA On' : 'MFA Off'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Department</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.department || '—'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatLastLogin(user.last_login)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewUser(user)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
