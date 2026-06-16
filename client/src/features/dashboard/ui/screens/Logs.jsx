import React, { useState } from 'react';
import { ShieldAlert, Activity, Filter, Key, Database, UserCheck, AlertTriangle } from 'lucide-react';

const Logs = () => {
  const [filter, setFilter] = useState('ALL');
  const [visibleLogs, setVisibleLogs] = useState(5);

  const dummyLogs = [
    { id: 1, type: 'SECURITY', message: 'Failed login attempt from unknown IP: 192.168.1.45', time: '10 mins ago', user: 'System', severity: 'high' },
    { id: 2, type: 'DATA', message: 'New Team "Mumbai Indians" added successfully', time: '1 hour ago', user: 'Super Admin', severity: 'info' },
    { id: 3, type: 'AUTH', message: 'Admin role granted to ricky.ponting@cricket.com', time: '3 hours ago', user: 'Super Admin', severity: 'warning' },
    { id: 4, type: 'DATA', message: 'Match #102 status changed to LIVE', time: '5 hours ago', user: 'Scorer 1', severity: 'info' },
    { id: 5, type: 'SYSTEM', message: 'Daily database backup completed successfully', time: '12 hours ago', user: 'System', severity: 'info' },
    { id: 6, type: 'AUTH', message: 'Logout successful', time: '1 day ago', user: 'Admin', severity: 'info' },
    { id: 7, type: 'SECURITY', message: 'Multiple failed password attempts', time: '1 day ago', user: 'Unknown', severity: 'high' },
  ];

  const filteredLogs = dummyLogs.filter(log => filter === 'ALL' ? true : log.type === filter);
  const displayedLogs = filteredLogs.slice(0, visibleLogs);

  const getLogIcon = (type) => {
    switch (type) {
      case 'SECURITY': return <ShieldAlert size={16} className="text-[#dc2626]" />;
      case 'DATA': return <Database size={16} className="text-[#2ebd4f]" />;
      case 'AUTH': return <Key size={16} className="text-[#f59e0b]" />;
      case 'SYSTEM': return <Activity size={16} className="text-[#4f46e5]" />;
      default: return <UserCheck size={16} className="text-slate-500" />;
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high': return 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]';
      case 'warning': return 'bg-[#fffbeb] border-[#fef3c7] text-[#b45309]';
      default: return 'bg-[#f8fafc] border-slate-200 text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Audit Trails</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">System Logs</h2>
          <p className="text-[15px] text-slate-600 mt-1">Review system activities, security events, and data changes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-slate-400" strokeWidth={2.5} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-md shadow-sm outline-none focus:ring-2 focus:ring-[#2ebd4f]"
          >
            <option value="ALL">All Events</option>
            <option value="SECURITY">Security</option>
            <option value="DATA">Data</option>
            <option value="AUTH">Authentication</option>
            <option value="SYSTEM">System</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
        <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#fafafa]">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <Activity size={18} className="mr-2 text-slate-500" /> Recent Activity (Showing {displayedLogs.length} of {filteredLogs.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#e5e7eb]">
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700 w-16">Event</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700 w-1/2">Description</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Timestamp</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Initiator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {displayedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className={`w-8 h-8 rounded flex items-center justify-center border ${getSeverityStyles(log.severity)}`}>
                      {getLogIcon(log.type)}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <p className="font-bold text-[14px] text-slate-800">{log.message}</p>
                    <p className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{log.type}</p>
                  </td>
                  <td className="py-5 px-6 font-medium text-[13px] text-slate-500">{log.time}</td>
                  <td className="py-5 px-6 font-bold text-[13px] text-[#1E402F]">{log.user}</td>
                </tr>
              ))}
              {displayedLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500 font-bold">No logs matching filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {visibleLogs < filteredLogs.length && (
          <div className="p-4 border-t border-[#e5e7eb] bg-[#f8fafc] flex justify-center">
            <button onClick={() => setVisibleLogs(prev => prev + 5)} className="text-[13px] font-bold text-[#4f46e5] hover:text-[#3730a3] transition-colors">Load More Logs</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
