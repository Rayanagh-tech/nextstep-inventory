
import { NavLink } from 'react-router-dom';
import {
  Home,
  Database,
  Settings,
  Users,
  Bell,
  Calendar,
  Folder,
  MonitorSmartphone,
  HardDrive,
  ArchiveRestore,
  Building,
  Activity,
  Tags,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Physical Servers', href: '/servers', icon: Database },
  { name: 'Virtual Machines', href: '/vms', icon: MonitorSmartphone },
  { name: 'Storage Bays', href: '/storage', icon: HardDrive },
  { name: 'Data centers', href: '/datacenters', icon: Building },
  { name: 'Backup Policies', href: '/backup-policies', icon: ArchiveRestore },
  { name: 'Tags', href: '/tags', icon: Tags },
  { name: 'User Management', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = ({ collapsed }: SidebarProps) => {
  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">NS</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">NextStep IT</span>
          )}
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
