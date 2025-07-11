export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical' | 'high' | 'medium';
  status: 'open' | 'acknowledged' | 'resolved';
  timestamp: string;
}
