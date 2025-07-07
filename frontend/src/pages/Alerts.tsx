import { useEffect, useState } from 'react';
import { Search, Bell, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { getAllAlerts } from '@/services/alertService';
import type { Alert } from '@/types/entities/Alert';

const Alerts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAllAlerts();
        setAlerts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'info': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <Bell className="w-5 h-5 text-blue-600" />;
      case 'info': return <Info className="w-5 h-5 text-gray-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const title = (alert as any).title ?? alert.type ?? '';
    const description = (alert as any).description ?? alert.message ?? '';
    const source = (alert as any).source ?? '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute(s) ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours} hour(s) ago`;
    return `${Math.floor(hours / 24)} day(s) ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>Resolve All</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="warning">Warning</option>
            <option value="medium">Medium</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const severity = alert.severity || 'unknown';
          const status = alert.status || 'unknown';
          const title = (alert as any).title ?? alert.type;
          const description = (alert as any).description ?? alert.message;
          const source = (alert as any).source ?? 'Unknown';

          return (
            <div
              key={alert.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getSeverityIcon(severity)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getSeverityColor(severity)}`}>
                        {severity}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{description}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-x-6">
                      <span><strong>Source:</strong> {source}</span>
                      <span>{formatTimestamp(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm border border-blue-200 dark:border-blue-700 px-3 py-1 rounded-lg">
                    Acknowledge
                  </button>
                  <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm border border-green-200 dark:border-green-700 px-3 py-1 rounded-lg">
                    Resolve
                  </button>
                  <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && filteredAlerts.length === 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-12 text-center rounded-xl">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No alerts found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
};

export default Alerts;
