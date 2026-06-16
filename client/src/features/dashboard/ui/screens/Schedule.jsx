import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import { Calendar as CalendarIcon, MapPin, Clock, CheckCircle, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches } from '../../state/matchSlice';
import ScheduleMatchModal from '../components/ScheduleMatchModal';

const Schedule = () => {
  const dispatch = useDispatch();
  const { matches, isLoading } = useSelector((state) => state.match);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {isModalOpen && <ScheduleMatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Match Scheduling</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Master Schedule</h2>
          <p className="text-[15px] text-slate-600 mt-1">Manage and coordinate all upcoming domestic and international fixtures.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-5 py-3 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors tracking-wide">
          <Plus size={18} className="mr-2" strokeWidth={2.5} />
          Schedule New Match
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Fixtures" value="142" icon={CalendarIcon} badgeText="+12 this month" badgeColor="bg-[#e0e7ff] text-[#4f46e5]" />
        <KPICard title="Live Now" value="4" icon={Clock} badgeText="Currently Scoring" badgeColor="text-[#d32f2f] bg-transparent p-0" />
        <KPICard title="Pending Approval" value="12" icon={CheckCircle} />
        <KPICard title="Venues Active" value="8" icon={MapPin} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h3 className="text-[16px] font-bold text-slate-800">Upcoming Fixtures</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e5e7eb]">
                  <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Match Details</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Venue / Format</th>
                  <th className="py-4 px-6 text-[13px] font-bold text-slate-700 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-500 font-bold">Loading matches...</td>
                  </tr>
                ) : matches.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-500 font-bold">No matches scheduled.</td>
                  </tr>
                ) : (
                  matches.map((match) => (
                    <tr key={match._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-5 px-6">
                        <p className="font-bold text-[15px] text-[#1E402F] tracking-wide">
                          {match.team1?.shortName || 'TBA'} vs {match.team2?.shortName || 'TBA'}
                        </p>
                        <p className="text-[13px] font-medium text-slate-500 mt-1 flex items-center">
                          <Clock size={14} className="mr-1.5 opacity-70" /> 
                          {new Date(match.dateTime).toLocaleDateString()} • {new Date(match.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </td>
                      <td className="py-5 px-6">
                        <p className="font-bold text-[14px] text-slate-700">{match.venue || 'TBA'}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] text-slate-600 text-[11px] rounded font-bold uppercase tracking-wider">{match.format || 'T20'}</span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <StatusBadge status={match.status === 'live' ? 'Live' : match.status === 'upcoming' ? 'Scheduled' : 'Completed'} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
            <h3 className="text-[16px] font-bold text-slate-800 mb-5">Next Major Venue</h3>
            <div className="h-44 rounded-md bg-slate-200 mb-5 bg-cover bg-center border border-slate-200" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}>
            </div>
            <h4 className="font-bold text-[16px] text-slate-900">Lord's, London</h4>
            <div className="mt-4">
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-slate-500 font-bold">Capacity</span>
                <span className="text-slate-800 font-bold tracking-wide">28,000 / 30,000</span>
              </div>
              <div className="w-full bg-[#f1f5f9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#2ebd4f] h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
