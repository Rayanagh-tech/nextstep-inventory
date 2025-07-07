import type { User } from './entities/User';
import type { Server } from './entities/Server';
import type { Vm } from './entities/Vm';
import type { StorageBay } from './entities/StorageBay';
import type { Alert } from './entities/Alert';
import type { BackupPolicy, CreateBackupPolicyDto, UpdateBackupPolicyDto } from './entities/BackupPolicy';
import type { Tag } from './entities/Tag';
import type { Datacenter, DatacenterCreateDto, DatacenterUpdateDto } from './entities/Datacenter';
import type {
  VSphereConnectionCreate,
  VSphereConnectionUpdate,
  ConnectionTestResult,
  VsphereConnection,
} from './entities/VsphereConnection';




// Store interface
export interface Store {
  // 🔐 Auth
  user: User | null;
  setUser: (user: Partial<User> | null) => void;
  clearUser: () => void;
  logout: () => void;

  // 🕹️ UI State
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // 📦 Inventory Data
  users: User[];
  servers: Server[];
  vms: Vm[];
  storageBays: StorageBay[];
  alerts: Alert[];
  backupPolicies: BackupPolicy[];
  tags: Tag[];
  vsphereConnections: VsphereConnection[];
  datacenters: Datacenter[];


  // 📡 Fetchers
  fetchUsers: () => Promise<void>;
  fetchServers: () => Promise<void>;
  fetchVms: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchBackupPolicies: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchVsphereConnections: () => Promise<void>;
  fetchDatacenters: () => Promise<void>;
  fetchBackupPolicyById: (id: string) => Promise<void>;
  fetchStorageBayById: (id: string) => Promise<void>;
  fetchStorageBays: () => Promise<void>;
  createStorageBay: (data: Partial<StorageBay>) => Promise<void>;
  updateStorageBay: (id: string, updates: Partial<StorageBay>) => Promise<void>;
  deleteStorageBay: (id: string) => Promise<void>;

 

  // 🔄 User Profile Management
  refreshUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<User | void>;
  

  // 🔄 vSphere Connections
  createVsphereConnection: (connectionData: VSphereConnectionCreate) => Promise<void>;
  updateVsphereConnection: (id: string, updates: VSphereConnectionUpdate) => Promise<void>;
  deleteVsphereConnection: (id: string) => Promise<void>;
  testVsphereConnection: (connectionData: VSphereConnectionCreate) => Promise<ConnectionTestResult>;

  // 🔄 Backup Policies
  createBackupPolicy: (policyData: CreateBackupPolicyDto) => Promise<void>;
  updateBackupPolicy: (id: string, updates: UpdateBackupPolicyDto) => Promise<void>;
  deleteBackupPolicy: (id: string) => Promise<void>;
  

  // 🔄 Datacenters
  createDatacenter: (datacenterData: DatacenterCreateDto) => Promise<void>;
  updateDatacenter: (id: string, updates: DatacenterUpdateDto) => Promise<void>;
  deleteDatacenter: (id: string) => Promise<void>;

  // 🔄 Virtual Machines
createVm: (data: Partial<Vm>) => Promise<void>;
updateVm: (id: string, updates: Partial<Vm>) => Promise<void>;
deleteVm: (id: string) => Promise<void>;

// 🔄 Servers
createServer: (data: Partial<Server>) => Promise<void>;
updateServer: (id: string, updates: Partial<Server>) => Promise<void>;
deleteServer: (id: string) => Promise<void>;

// 🔄 Alerts
createAlert: (data: Partial<Alert>) => Promise<void>;
updateAlert: (id: string, updates: Partial<Alert>) => Promise<void>;
deleteAlert: (id: string) => Promise<void>;


}

// ✅ Re-export types for use elsewhere
export type {
  User,
  Server,
  Vm,
  StorageBay,
  Alert,
  BackupPolicy,
  Tag,
  VsphereConnection,
  VSphereConnectionCreate,
  VSphereConnectionUpdate,
  ConnectionTestResult,
  Datacenter,
  DatacenterCreateDto,
  DatacenterUpdateDto,
  CreateBackupPolicyDto,
  UpdateBackupPolicyDto,


};
