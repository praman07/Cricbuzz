import React, { useEffect } from 'react';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import { Users, Activity, BarChart2, AlertCircle, Download, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers } from '../../state/playerSlice';

const Players = () => {
  const dispatch = useDispatch();
  const { players, isLoading } = useSelector((state) => state.player);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Player Management</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Player Roster</h2>
          <p className="text-[15px] text-slate-600 mt-1">Review stats, manage injuries, and update global player profiles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Players" value={players.length.toString()} icon={Users} badgeText="+2 this week" badgeColor="bg-[#e7f9eb] text-[#2ebd4f]" />
        <KPICard title="Active Matches" value="4" icon={Activity} badgeText="Currently Scoring" badgeColor="text-[#d32f2f] bg-transparent p-0" />
        <KPICard title="Avg. Performance" value="86%" icon={BarChart2} />
        <KPICard title="Pending Approvals" value="28" icon={AlertCircle} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
        <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between">
          <div className="flex space-x-4">
            <select className="px-4 py-2.5 bg-[#f3f4f6] border-none rounded-md text-[14px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1E402F]">
              <option>All Teams</option>
              <option>RCB</option>
              <option>MI</option>
              <option>CSK</option>
            </select>
            <select className="px-4 py-2.5 bg-[#f3f4f6] border-none rounded-md text-[14px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1E402F]">
              <option>All Status</option>
              <option>Active</option>
              <option>Injured</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e5e7eb]">
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700 w-1/3">Player</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Team</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Role</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Avg</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Strike Rate</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-bold">Loading players...</td>
                </tr>
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-bold">No players found.</td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr key={player._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                          <img src={`https://ui-avatars.com/api/?name=${player.name.replace(' ', '+')}&background=random`} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <p className="font-bold text-[15px] text-slate-900">{player.name}</p>
                          <p className="text-[12px] font-bold text-slate-500 tracking-wide mt-0.5">{player._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[12px] font-bold rounded border border-[#e5e7eb] uppercase tracking-wide">{player.team?.shortName || 'UNASSIGNED'}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-bold text-[14px]">{player.role}</td>
                    <td className="py-4 px-6 text-[#1E402F] font-bold text-[15px]">{player.battingStyle || '-'}</td>
                    <td className="py-4 px-6 text-[#1E402F] font-bold text-[15px]">{player.bowlingStyle || '-'}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={player.status || 'Active'} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-[#e5e7eb] flex items-center justify-between text-[13px] font-bold text-slate-500">
          <span>Showing 1 to {players.length} of {players.length} entries</span>
          <div className="flex space-x-1.5">
            <button className="px-3 py-1.5 bg-[#f3f4f6] rounded border border-transparent hover:border-slate-300 transition-colors">Prev</button>
            <button className="px-3 py-1.5 bg-[#1E402F] text-white rounded">1</button>
            <button className="px-3 py-1.5 bg-[#f3f4f6] rounded border border-transparent hover:border-slate-300 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Players;
