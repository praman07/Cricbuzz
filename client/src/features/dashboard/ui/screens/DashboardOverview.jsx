import React, { useEffect } from 'react';
import KPICard from '../components/KPICard';
import { Users, Globe, MonitorPlay, Calendar as CalendarIcon, ShieldAlert, BarChart2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../state/teamSlice';
import { fetchPlayers } from '../../state/playerSlice';
import { fetchMatches } from '../../state/matchSlice';

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { teams, isLoading: isLoadingTeams } = useSelector((state) => state.team);
  const { players, isLoading: isLoadingPlayers } = useSelector((state) => state.player);
  const { matches, isLoading: isLoadingMatches } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchPlayers());
    dispatch(fetchMatches());
  }, [dispatch]);

  const liveMatchesCount = matches.filter(m => m.status === 'live').length;
  const upcomingMatchesCount = matches.filter(m => m.status === 'upcoming').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Overview</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Dashboard</h2>
          <p className="text-[15px] text-slate-600 mt-1">High-level metrics and system activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Teams" 
          value={isLoadingTeams ? "..." : teams.length.toString()} 
          icon={Globe} 
          badgeText="Active" 
          badgeColor="bg-[#e0e7ff] text-[#4f46e5]" 
        />
        <KPICard 
          title="Total Players" 
          value={isLoadingPlayers ? "..." : players.length.toString()} 
          icon={Users} 
          badgeText="Registered" 
          badgeColor="bg-[#e7f9eb] text-[#2ebd4f]" 
        />
        <KPICard 
          title="Upcoming Fixtures" 
          value={isLoadingMatches ? "..." : upcomingMatchesCount.toString()} 
          icon={CalendarIcon} 
        />
        <KPICard 
          title="Live Matches" 
          value={isLoadingMatches ? "..." : liveMatchesCount.toString()} 
          icon={MonitorPlay} 
          badgeText="Now Scoring" 
          badgeColor="text-[#d32f2f] bg-[#ffebee] border border-[#ffcdd2]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6 h-96 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <BarChart2 size={120} />
           </div>
           <h3 className="absolute top-6 left-6 text-[18px] font-bold text-slate-900">Traffic & API Usage</h3>
           
           <div className="flex items-end justify-between w-full h-48 px-10 gap-2 mt-8 z-10">
              {[40, 60, 30, 80, 50, 90, 70, 45, 85, 55, 65, 35, 75, 95].map((height, i) => (
                <div key={i} className="w-full bg-[#e7f9eb] hover:bg-[#2ebd4f] transition-all duration-300 rounded-t-sm" style={{ height: `${height}%` }}></div>
              ))}
           </div>
           <div className="w-full border-t border-slate-100 mt-2 px-10 flex justify-between text-[11px] font-bold text-slate-400">
             <span>Mon</span>
             <span>Tue</span>
             <span>Wed</span>
             <span>Thu</span>
             <span>Fri</span>
             <span>Sat</span>
             <span>Sun</span>
           </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-slate-800">System Health</h3>
          </div>
          
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#2ebd4f] animate-pulse mr-3"></div>
                  <span className="text-[14px] font-bold text-slate-700">Database Connection</span>
                </div>
                <span className="text-[13px] font-bold text-[#2ebd4f]">Stable</span>
             </div>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#2ebd4f] animate-pulse mr-3"></div>
                  <span className="text-[14px] font-bold text-slate-700">API Gateway</span>
                </div>
                <span className="text-[13px] font-bold text-[#2ebd4f]">Online</span>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b] mr-3"></div>
                  <span className="text-[14px] font-bold text-slate-700">Storage Capacity</span>
                </div>
                <span className="text-[13px] font-bold text-slate-500">78% Used</span>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center p-3 bg-[#fffbeb] text-[#d97706] rounded border border-[#fef3c7]">
                   <ShieldAlert size={16} className="mr-2" />
                   <span className="text-[13px] font-bold">1 Admin login from unknown IP</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
