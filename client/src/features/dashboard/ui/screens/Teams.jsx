import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import { Users, Globe, Radio, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../state/teamSlice';
import AddTeamModal from '../components/AddTeamModal';

const Teams = () => {
  const dispatch = useDispatch();
  const { teams, isLoading } = useSelector((state) => state.team);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {isModalOpen && <AddTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Teams Management</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Registered Teams</h2>
          <p className="text-[15px] text-slate-600 mt-1">Manage the elite roster of domestic and international cricket franchises.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-5 py-3 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors tracking-wide">
          <Plus size={18} className="mr-2" strokeWidth={2.5} />
          Add New Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Teams" 
          value={teams.length.toString()} 
          icon={Users} 
          badgeText="ACTIVE ROSTER" 
          badgeColor="bg-[#e7f9eb] text-[#2ebd4f]" 
        />
        <KPICard 
          title="Countries" 
          value={[...new Set(teams.map(t => t.country))].length.toString()} 
          icon={Globe} 
          subtitle="International & Associate Members" 
        />
        <KPICard 
          title="Live Matches" 
          value="04" 
          icon={Radio} 
          badgeText="Currently Scoring" 
          badgeColor="text-[#d32f2f] bg-transparent p-0" 
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden relative">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none -mr-10 -mb-10 w-[300px] h-[300px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjBjMTEuMDQ2IDAgMjAtOC45NTQgMjAtMjBIMHYyMGMwIDExLjA0NiA4Ljk1NCAyMCAyMCAyMHpNMCAwaDQwdjQwaC00MFYwaDB6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] transform rotate-45"></div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e5e7eb]">
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700 w-1/4">Team Entity</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Short Name</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Captain</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Home Ground</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Country</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-bold">Loading teams...</td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-bold">No teams found.</td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                          <span className="text-white font-bold">{team.shortName.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <p className="font-bold text-[15px] text-slate-900">{team.name}</p>
                          <p className="text-[12px] font-medium text-slate-500 tracking-wide uppercase mt-0.5">{team.type || 'FRANCHISE'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-bold text-[15px] text-slate-800">{team.shortName}</td>
                    <td className="py-5 px-6 font-medium text-[14px] text-slate-600">{team.captain?.name || 'TBD'}</td>
                    <td className="py-5 px-6 font-medium text-[14px] text-slate-600">{team.homeGround}</td>
                    <td className="py-5 px-6">
                      <span className="inline-flex px-2 py-1 bg-[#e0e7ff] text-[#4f46e5] text-[11px] font-bold rounded tracking-wide uppercase">{team.country}</span>
                    </td>
                    <td className="py-5 px-6 text-right">
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Teams;
