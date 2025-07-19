import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Server, StorageBay, Store, User } from '../types/store';
import type {
  VSphereConnectionCreate,
  VSphereConnectionUpdate,
  ConnectionTestResult,
} from '../types/entities/VsphereConnection';
import { getUserById, updateUser, getAllUsers } from '@/services/userService';
import {
  getAllConnections,
  createConnection,
  updateConnection,
  deleteConnection,
  testConnection,
} from '@/services/vsphereService';
import {Datacenter} from '../types/entities/Datacenter'; // adjust path if different
import { getAllDatacenters, createDatacenter, updateDatacenter, deleteDatacenter } from '@/services/datacenterService';
import { fetchTags } from '@/services/tagService';
import BackupPoliciesService from '@/services/BackupPoliciesService';

import {
  getAllStorageBays,
  createStorageBay,
  updateStorageBay,
  deleteStorageBay,
  getStorageBayById,

} from '@/services/storageBaysService';

import {
  getAllVms,
  createVm,
  updateVm,
  deleteVm,
} from '@/services/vmService.ts';
import { getAllServers,
  createServer,
  updateServer,
  deleteServer,
 } from '@/services/serverService';
 import { getDatacenterMetrics, getRecentActivity, getSystemHeartbeats, getStorageUsage, getVmTrends } from '@/services/dashboardService';
import { getVmMetricLogs } from '@/services/dashboardService';



export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // 🔐 Auth
      user: null,

      setUser: (user) => {
        if (user?.id) {
          localStorage.setItem('userId', user.id); // 💾 Save user ID
        }
        set({ user: user as any });
      },

      clearUser: () => {
        localStorage.removeItem('userId'); // 🧹 Clear user ID
        set({ user: null });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        set({
          user: null,
          vsphereConnections: [],
          datacenters: [],
        });
        window.location.href = '/login'; // ⬅️ Redirect to login
      },

      // 🕹️ UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // 📦 Inventory Data
      users: [],
      servers: [],
      vms: [],
      storageBays: [],
      backupPolicies: [],
      tags: [],
      vsphereConnections: [],
      datacenters: [],
      datacenterMetrics: [],
      storageUsage: [],
      systemHeartbeats: [],
      recentActivity: [],
      vmTrends: [],
      vmMetricLogs: [],
      
      



      fetchUsers: async () => {
        try {
          const users = await getAllUsers(); // ✅ Secure + clean
          set({ users });
        } catch (err: any) {
          console.error('❌ Failed to fetch users:', err?.response?.data || err.message);
        }
      },

      fetchServers: async () => {
        try {
          const servers = await getAllServers();
          console.log('Fetched servers:', servers); // ✅ ADD THIS
          set({ servers });
        } catch (err) {
          console.error('Failed to fetch servers:', err);
        }
      },

      // store.ts
fetchVms: async () => {
  try {
    const data = await getAllVms(); // <- vmService.ts
    console.log('Fetched VMs:', data); // ✅ ADD THIS
    set({ vms: data });
  } catch (error) {
    console.error('Failed to fetch VMs:', error);
  }
}
,

      fetchStorageBays: async () => {
        try {
          const bays = await getAllStorageBays();
          set({ storageBays: bays });
        } catch (err) {
          console.error('Failed to fetch storage bays:', err);
        }
      },

      

      fetchTags: async () => {
        try {
          const tags = await fetchTags();
          set({ tags });
        } catch (err) {
          console.error('Failed to fetch tags:', err);
        }
      },

      // 🔄 User Profile Sync
      refreshUserProfile: async () => {
        const stored = get().user;
        if (!stored?.id) return;
        try {
          const fresh = await getUserById(stored.id);
          set({ user: fresh });
        } catch (error) {
          console.error('Failed to refresh user profile:', error);
        }
      },

      updateUserProfile: async (updates: Partial<User>) => {
        const stored = get().user;
        if (!stored?.id) return;
      
        const safeUpdates = { ...updates };
      
        // 🔐 Prevent regular users from submitting `role` accidentally or via dev tools
        if (stored.role !== 'admin') {
          delete safeUpdates.role;
        }
      
        try {
          await updateUser(stored.id, safeUpdates);
          const fresh = await getUserById(stored.id);
          set({ user: fresh });
          return fresh;
        } catch (error: any) {
          console.error('Failed to update user profile:', error);
          throw error;
        }
      },
       // 🔄 vSphere Connection Logic
       fetchVsphereConnections: async () => {
        try {
          const connections = await getAllConnections(); // now an array
          set({ vsphereConnections: connections });
        } catch (err) {
          console.error('Failed to fetch vSphere connections:', err);
          set({ vsphereConnections: [] });
        }
      },
      
      
      

      createVsphereConnection: async (connectionData: VSphereConnectionCreate) => {
        try {
          await createConnection(connectionData);
          await get().fetchVsphereConnections();
        } catch (err) {
          console.error('Failed to create vSphere connection:', err);
          throw err;
        }
      },

      updateVsphereConnection: async (id: string, updates: VSphereConnectionUpdate) => {
        try {
          await updateConnection(id, updates);
          await get().fetchVsphereConnections();
        } catch (err) {
          console.error('Failed to update vSphere connection:', err);
          throw err;
        }
      },
      deleteVsphereConnection: async (id: string) => {
        try {
          await deleteConnection(id);
          await get().fetchVsphereConnections();
        } catch (err) {
          console.error('Failed to delete vSphere connection:', err);
          throw err;
        }
      },
      testVsphereConnection: async (connectionData: VSphereConnectionCreate): Promise<ConnectionTestResult> => {
        try {
          return await testConnection({
            vcenter_url: connectionData.api_url ?? '', // or use another field like `api_url` if you have one
            api_username: connectionData.api_username,
            api_password: connectionData.api_password,
          });
        } catch (err) {
          console.error('Failed to test vSphere connection:', err);
          throw err;
        }
      },

      // 📍 Datacenter Fetcher
      fetchDatacenters: async () => {
  try {
    const datacenters: Datacenter[] = await getAllDatacenters(); // ✅ fetch & set
    set({ datacenters });
  } catch (err) {
    console.error('Failed to fetch datacenters:', err);
  }
},

createBackupPolicy: async (data) => {
  try {
    const newPolicy = await BackupPoliciesService.create(data);
    set((state) => ({ backupPolicies: [...state.backupPolicies, newPolicy] }));
  } catch (err) {
    console.error('Failed to create backup policy:', err);
    throw err;
  }
},

fetchBackupPolicies: async () => {
  try {
    const policies = await BackupPoliciesService.getAll();
    set({ backupPolicies: policies });
  } catch (err) {
    console.error('Failed to fetch backup policies:', err);
  }
},

fetchBackupPolicyById: async (id: string) => {
  try {
    const policy = await BackupPoliciesService.getById(id);
    set({ backupPolicies: [policy] }); // Wrap it in an array
  } catch (err) {
    console.error('Failed to fetch backup policy by id:', err);
    throw err;
  }
},

updateBackupPolicy: async (id, data) => {
  try {
    const updated = await BackupPoliciesService.update(id, data);
    set((state) => ({
      backupPolicies: state.backupPolicies.map((p) => (p.id === id ? updated : p)),
    }));
  } catch (err) {
    console.error('Failed to update backup policy:', err);
    throw err;
  }
},

deleteBackupPolicy: async (id: string) => {
  try {
    await BackupPoliciesService.delete(id);
    set((state) => ({
      backupPolicies: state.backupPolicies.filter((p) => p.id !== id),
    }));
  } catch (err) {
    console.error('Failed to delete backup policy:', err);
    throw err;
  }
},

deleteDatacenter: async (id: string) => {
  try {
    await deleteDatacenter(id); // calls the service
    set((state) => ({
      datacenters: state.datacenters.filter((d) => d.id !== id),
    }));
  } catch (err) {
    console.error('Failed to delete datacenter:', err);
    throw err;
  }
},
createDatacenter: async (datacenterData) => {
  try {
    const newDC = await createDatacenter(datacenterData); // call service
    set((state) => ({ datacenters: [...state.datacenters, newDC] }));
  } catch (err) {
    console.error('Failed to create datacenter:', err);
    throw err;
  }
},

updateDatacenter: async (id, updates) => {
  try {
    const updated = await updateDatacenter(id, updates); // call service
    set((state) => ({
      datacenters: state.datacenters.map((d) => (d.id === id ? updated : d)),
    }));
  } catch (err) {
    console.error('Failed to update datacenter:', err);
    throw err;
  }
},


createStorageBay: async (data: Partial<StorageBay>) => {
  try {
    const newBay = await createStorageBay(data);
    set((state) => ({
      storageBays: [...state.storageBays, newBay],
    }));
  } catch (err) {
    console.error('Failed to create storage bay:', err);
    throw err;
  }
},

updateStorageBay: async (id: string, updates: Partial<StorageBay>) => {
  try {
    const updated = await updateStorageBay(id, updates);
    set((state) => ({
      storageBays: state.storageBays.map((b) => (b.id === id ? updated : b)),
    }));
  } catch (err) {
    console.error('Failed to update storage bay:', err);
    throw err;
  }
},

deleteStorageBay: async (id: string) => {
  try {
    await deleteStorageBay(id);
    set((state) => ({
      storageBays: state.storageBays.filter((b) => b.id !== id),
    }));
  } catch (err) {
    console.error('Failed to delete storage bay:', err);
    throw err;
  }
},

fetchStorageBayById: async (id: string) => {
  try {
    const bay = await getStorageBayById(id);
    set((state) => ({
      storageBays: [
        ...state.storageBays.filter((b) => b.id !== bay.id),
        bay,
      ],
    }));
  } catch (err) {
    console.error('❌ Failed to fetch storage bay by ID:', err);
    throw err;
  }
},

createVm: async (data) => {
  try {
    await createVm(data);
    await get().fetchVms();
  } catch (err) {
    console.error('Failed to create VM:', err);
    throw err;
  }
},

updateVm: async (id, updates) => {
  try {
    await updateVm(id, updates);
    await get().fetchVms();
  } catch (err) {
    console.error('Failed to update VM:', err);
    throw err;
  }
},

deleteVm: async (id) => {
  try {
    await deleteVm(id);
    await get().fetchVms();
  } catch (err) {
    console.error('Failed to delete VM:', err);
    throw err;
  }
},

createServer: async (data: Partial<Server>) => {
  try {
    await createServer(data);
    await get().fetchServers();
  } catch (err) {
    console.error('Failed to create server:', err);
    throw err;
  }
},

updateServer: async (id: string, updates: Partial<Server>) => {
  try {
    await updateServer(id, updates);
    await get().fetchServers();
  } catch (err) {
    console.error('Failed to update server:', err);
    throw err;
  }
},

deleteServer: async (id: string) => {
  try {
    await deleteServer(id);
    await get().fetchServers();
  } catch (err) {
    console.error('Failed to delete server:', err);
    throw err;
  }
},

fetchDashboardMetrics: async () => {
  const {
    fetchDatacenterMetrics,
    fetchStorageUsage,
    fetchSystemHeartbeats,
    fetchRecentActivity,
    fetchVmTrends,
  } = get();
  await Promise.all([
    fetchDatacenterMetrics(),
    fetchStorageUsage(),
    fetchSystemHeartbeats(),
    fetchRecentActivity(),
    fetchVmTrends(),
  ]);
},




fetchDatacenterMetrics: async () => {
  try {
    const data = await getDatacenterMetrics();
    set({ datacenterMetrics: data });
  } catch (err) {
    console.error('Failed to fetch datacenter metrics:', err);
  }
},

fetchStorageUsage: async () => {
  try {
    const data = await getStorageUsage();
    set({ storageUsage: data });
  } catch (error) {
    console.error("Failed to fetch storage usage:", error);
  }
},


fetchSystemHeartbeats: async () => {
  try {
    const data = await getSystemHeartbeats();
    set({ systemHeartbeats: data });
  } catch (err) {
    console.error('Failed to fetch system heartbeats:', err);
  }
},

fetchRecentActivity: async () => {
  try {
    const data = await getRecentActivity();
    set({ recentActivity: data });
  } catch (err) {
    console.error('Failed to fetch recent activity:', err);
  }
},

fetchVmTrends: async () => {
  try {
    const data = await getVmTrends();
    set({ vmTrends: data });
  } catch (err) {
    console.error('Failed to fetch VM trends:', err);
  }
},
fetchVmMetricLogs: async () => {
  try {
    const logs = await getVmMetricLogs();
    set({ vmMetricLogs: logs });
  } catch (err) {
    console.error('Failed to fetch VM metric logs:', err);
  }
},













    }),
    {
      name: 'inventory-store',
    version: 1,
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      user: state.user, // Only keep `user` in localStorage
    }),
    }
  )
);
