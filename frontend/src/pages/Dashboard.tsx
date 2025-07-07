
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Database, Bell, Users, Activity } from 'lucide-react';

const Dashboard = () => {
  const kpiData = [
    { title: 'Total Servers', value: '247', change: '+12%', icon: Database, color: 'blue' },
    { title: 'Active VMs', value: '1,843', change: '+8%', icon: Activity, color: 'green' },
    { title: 'Storage Used', value: '89.2 TB', change: '+15%', color: 'purple' },
    { title: 'Active Alerts', value: '23', change: '-5%', icon: Bell, color: 'red' },
  ];

  const serverData = [
    { name: 'Web Servers', count: 45, utilization: 78 },
    { name: 'Database', count: 32, utilization: 85 },
    { name: 'Application', count: 67, utilization: 72 },
    { name: 'Storage', count: 23, utilization: 91 },
    { name: 'Backup', count: 18, utilization: 45 },
  ];

  const storageData = [
    { name: 'Used', value: 892, fill: '#3B82F6' },
    { name: 'Available', value: 108, fill: '#E5E7EB' },
  ];

  const uptimeData = [
    { time: '00:00', uptime: 99.9 },
    { time: '04:00', uptime: 99.8 },
    { time: '08:00', uptime: 99.9 },
    { time: '12:00', uptime: 99.7 },
    { time: '16:00', uptime: 99.9 },
    { time: '20:00', uptime: 99.8 },
    { time: '24:00', uptime: 99.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} from last month
                </p>
              </div>
              {kpi.icon && (
                <div className={`p-3 rounded-lg bg-${kpi.color}-100 dark:bg-${kpi.color}-900`}>
                  <kpi.icon className={`w-6 h-6 text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Utilization Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Server Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serverData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="utilization" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Storage Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={storageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {storageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Used (89.2%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Available (10.8%)</span>
            </div>
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Uptime (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis domain={[99.5, 100]} stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="uptime" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { type: 'Server', action: 'VM-WEB-01 deployed successfully', time: '2 minutes ago', status: 'success' },
            { type: 'Alert', action: 'High CPU usage on DB-PROD-03', time: '15 minutes ago', status: 'warning' },
            { type: 'Backup', action: 'Scheduled backup completed for Storage-Bay-A', time: '1 hour ago', status: 'success' },
            { type: 'User', action: 'New user John Smith added to system', time: '2 hours ago', status: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.type}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
