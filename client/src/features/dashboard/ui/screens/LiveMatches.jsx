import React, { useEffect } from 'react';
import { MonitorPlay, Clock, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches } from '../../state/matchSlice';
import { useNavigate } from 'react-router-dom';

const LiveMatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matches, isLoading } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const liveMatches = matches.filter((match) => match.status === 'live');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Live Matches</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Live Broadcast</h2>
          <p className="text-[15px] text-slate-600 mt-1">Monitor and manage all currently active fixtures.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden min-h-[60vh]">
        <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#fafafa]">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <MonitorPlay size={18} className="mr-2 text-[#2ebd4f]" /> Active Games ({liveMatches.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#2ebd4f] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Connecting to live feeds...</p>
          </div>
        ) : liveMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
               <AlertCircle size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Live Matches</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">There are currently no matches in progress. Check the Master Schedule for upcoming fixtures or start a new match.</p>
            <button onClick={() => navigate('/home/schedule')} className="px-6 py-2.5 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors">
              View Schedule
            </button>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <div key={match._id} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:border-[#bbf7d0] transition-colors group">
                 <div className="bg-[#f8fafc] p-4 flex justify-between items-center border-b border-slate-200">
                    <div className="flex items-center space-x-2 bg-[#ffebee] text-[#d32f2f] px-2.5 py-1 rounded border border-[#ffcdd2]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d32f2f] animate-pulse"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                    </div>
                    <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{match.format || 'T20'}</span>
                 </div>
                 <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                       <div className="flex flex-col items-center">
                          <span className="font-black text-2xl text-slate-800">{match.team1?.shortName || 'T1'}</span>
                       </div>
                       <span className="font-bold text-slate-300 text-sm">VS</span>
                       <div className="flex flex-col items-center">
                          <span className="font-black text-2xl text-slate-800">{match.team2?.shortName || 'T2'}</span>
                       </div>
                    </div>
                    <div className="flex items-center justify-center text-[12px] font-bold text-slate-500 mb-6 border-t border-slate-100 pt-4">
                       <Clock size={14} className="mr-1.5" /> 
                       {match.venue || 'TBA'}
                    </div>
                    <button onClick={() => navigate('/home')} className="w-full py-2.5 bg-[#e7f9eb] hover:bg-[#dcfce7] text-[#15803d] font-bold text-sm rounded transition-colors border border-[#bbf7d0]">
                       Open Scoring Panel
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
