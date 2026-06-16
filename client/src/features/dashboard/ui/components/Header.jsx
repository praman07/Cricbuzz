import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0 shadow-sm">
      <div className="flex items-center flex-1">
        <div className="relative flex items-center w-80">
          <Search className="absolute left-3 h-4 w-4 text-slate-500" strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search teams, players..." 
            className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4f6] border-none rounded-md text-[14px] text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1E402F] focus:outline-none transition-all placeholder:text-slate-500"
          />
        </div>
        
        <div className="ml-12 flex space-x-6 h-full items-center">
          {['Live', 'Schedule', 'Teams'].map((tab) => {
            const isActive = location.pathname.includes(`/${tab.toLowerCase()}`);
            return (
              <button 
                key={tab}
                onClick={() => handleNav(`/home/${tab.toLowerCase()}`)}
                className={`text-[14px] font-bold h-[72px] relative flex items-center ${
                  isActive ? 'text-[#1E402F]' : 'text-[#64748b] hover:text-slate-800'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2e7d32] rounded-t-sm"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={() => navigate('/home/live')} className="px-6 py-2.5 bg-[#1E402F] hover:bg-[#152e22] text-white text-[14px] font-bold rounded-md transition-colors shadow-sm tracking-wide">
          Go Live
        </button>
        
        <div className="flex items-center space-x-5 border-l border-slate-200 pl-6 h-8">
          <div onClick={() => navigate('/home/settings')} className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer border border-slate-300">
            <img src="https://ui-avatars.com/api/?name=Super+Admin&background=random" alt="Admin User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
