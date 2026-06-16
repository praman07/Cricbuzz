import React, { useState } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';

const DashboardHome = () => {
  const [score, setScore] = useState({ runs: 324, wickets: 4, overs: '45.2' });
  const [timeline, setTimeline] = useState(['1', '4', '0', 'W', '1', '2']);
  
  const handleRun = (r) => {
    setScore(prev => ({...prev, runs: prev.runs + r}));
    setTimeline(prev => [...prev, r.toString()].slice(-10));
  };
  const handleWicket = () => {
    setScore(prev => ({...prev, wickets: Math.min(10, prev.wickets + 1)}));
    setTimeline(prev => [...prev, 'W'].slice(-10));
  };
  const handleExtra = (type) => {
    setScore(prev => ({...prev, runs: prev.runs + 1}));
    setTimeline(prev => [...prev, type].slice(-10));
  };

  const getBallColor = (ball) => {
    if (ball === 'W') return 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]';
    if (ball === '4' || ball === '6') return 'bg-[#e7f9eb] text-[#2ebd4f] border-[#bbf7d0]';
    if (ball === 'Wd' || ball === 'Nb') return 'bg-[#e0e7ff] text-[#4f46e5] border-[#c7d2fe]';
    return 'bg-[#f1f5f9] text-slate-700 border-[#e2e8f0]';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Scoring Panel</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Live Scoring Dashboard</h2>
          <p className="text-[15px] text-slate-600 mt-1">Real-time match updates and score management.</p>
        </div>
      </div>

      {/* Live Score Banner */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] border-t-4 border-t-[#2ebd4f] overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjBjMTEuMDQ2IDAgMjAtOC45NTQgMjAtMjBIMHYyMGMwIDExLjA0NiA4Ljk1NCAyMCAyMCAyMHpNMCAwaDQwdjQwaC00MFYwaDB6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] pointer-events-none"></div>
          
          <div className="flex items-center space-x-8 z-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-100 shadow-sm">
                <span className="font-bold text-white text-xl">AUS</span>
              </div>
              <span className="font-bold mt-3 text-[15px] text-slate-800">Australia</span>
            </div>
            <span className="text-2xl font-black text-slate-300">VS</span>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-200 shadow-sm">
                <span className="font-bold text-slate-500 text-xl">ENG</span>
              </div>
              <span className="font-bold mt-3 text-[15px] text-slate-600">England</span>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 text-center flex flex-col items-center z-10">
            <div className="flex items-center space-x-2 bg-[#e7f9eb] text-[#2ebd4f] px-3 py-1 rounded border border-[#bbf7d0] mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2ebd4f] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Live Match</span>
            </div>
            <h2 className="text-[64px] font-black text-slate-900 tracking-tight leading-none">
              {score.runs}<span className="text-[40px] text-slate-400 font-bold">/{score.wickets}</span>
            </h2>
            <p className="text-slate-500 font-bold mt-2 text-[15px]">Overs: {score.overs}</p>
          </div>
          
          <div className="mt-6 md:mt-0 text-right z-10">
            <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Current Run Rate</p>
            <p className="text-3xl font-black text-[#1E402F] mt-1">7.15</p>
            <div className="mt-4 inline-block bg-slate-100 px-4 py-2 rounded border border-slate-200">
               <p className="text-[13px] font-bold text-slate-600">Target: <span className="text-slate-900">345</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scoring Controls */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[18px] font-bold text-slate-900">Update Scoreboard</h3>
            <button className="flex items-center text-[13px] font-bold text-[#4f46e5] hover:text-indigo-800 bg-[#e0e7ff] px-4 py-2 rounded transition-colors tracking-wide">
              <RotateCcw size={16} className="mr-2" strokeWidth={2.5} />
              Undo Last Entry
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[0, 1, 2, 3].map(run => (
              <button key={run} onClick={() => handleRun(run)} className="h-16 bg-[#f3f4f6] hover:bg-[#e5e7eb] border border-slate-200 text-slate-800 font-black text-2xl rounded-md transition-colors shadow-sm">
                {run}
              </button>
            ))}
            <button onClick={() => handleRun(4)} className="h-16 col-span-2 bg-[#e7f9eb] hover:bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] font-black text-2xl rounded-md transition-colors shadow-sm">
              4
            </button>
            <button onClick={() => handleRun(6)} className="h-16 col-span-2 bg-[#2ebd4f] hover:bg-[#22c55e] border border-[#16a34a] text-white shadow-sm font-black text-2xl rounded-md transition-colors">
              6
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleWicket} className="h-16 bg-[#ef4444] hover:bg-[#dc2626] border border-[#b91c1c] text-white font-black text-xl rounded-md shadow-sm transition-colors uppercase tracking-widest">
              Wicket
            </button>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => handleExtra('Wd')} className="h-16 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 text-slate-700 font-bold text-[15px] rounded-md transition-colors shadow-sm uppercase tracking-wide">Wide</button>
               <button onClick={() => handleExtra('Nb')} className="h-16 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 text-slate-700 font-bold text-[15px] rounded-md transition-colors shadow-sm uppercase tracking-wide">No Ball</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Players & Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
             <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-5 border-b border-[#e5e7eb] pb-3">Active Batsmen</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Play size={14} className="text-[#2ebd4f] mr-2.5" fill="currentColor" />
                    <span className="font-bold text-[15px] text-slate-800">D. Warner</span>
                  </div>
                  <span className="font-black text-slate-900 text-lg">84 <span className="text-[13px] text-slate-400 font-bold ml-1">(62)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-6">
                    <span className="font-bold text-[15px] text-slate-600">S. Smith</span>
                  </div>
                  <span className="font-black text-slate-900 text-lg">42 <span className="text-[13px] text-slate-400 font-bold ml-1">(38)</span></span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
             <div className="flex items-center justify-between mb-5 border-b border-[#e5e7eb] pb-3">
                <span className="flex items-center text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                  <Activity size={16} className="mr-2 text-slate-400" />
                  Recent Timeline
                </span>
             </div>
             <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-[13px] font-black text-slate-400 w-8">45</span>
                  <div className="flex flex-wrap gap-1.5">
                    {timeline.map((ball, idx) => (
                      <span key={idx} className={`w-8 h-8 rounded border flex items-center justify-center text-[13px] font-bold ${getBallColor(ball)}`}>
                        {ball}
                      </span>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;