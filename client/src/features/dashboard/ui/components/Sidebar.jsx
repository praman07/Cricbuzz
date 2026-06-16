import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, Users, ShieldAlert, MonitorPlay, Activity, Settings, Plus, HelpCircle, LogOut } from 'lucide-react';
import { removeUser } from '../../../auth/state/auth/authSlice';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    { name: 'Dashboard', path: '/home/dashboard', icon: LayoutDashboard },
    { name: 'Manage Admins', path: '/home/admins', icon: Users },
    { name: 'System Logs', path: '/home/logs', icon: ShieldAlert },
    { name: 'Live Matches', path: '/home/live', icon: MonitorPlay },
    { name: 'Scoring', path: '/home', icon: Activity },
    { name: 'Settings', path: '/home/settings', icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] bg-[#516170] flex flex-col z-20 font-sans">
      <div className="pt-6 px-6 pb-8">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
          Cricket<span className="text-[#84f092]">Manager</span> <span className="ml-1 text-white">Pro</span>
        </h1>
        <p className="text-[#a5b4c3] text-xs mt-1">Elite Performance Admin</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/home'}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-md transition-colors group ${
                  isActive
                    ? 'bg-[#3e4d5c] text-white'
                    : 'text-[#d1d9e0] hover:bg-[#3e4d5c] hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0 opacity-80" strokeWidth={1.5} />
              <span className="font-medium text-[15px]">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-5 pb-4 mt-auto">
        <div className="space-y-1">
          <button 
            onClick={() => navigate('/home/schedule')} 
            className="w-full mb-4 flex items-center justify-center px-4 py-3 bg-[#2ebd4f] hover:bg-[#25a242] text-white text-[14px] font-bold rounded-md shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={18} className="mr-2" strokeWidth={2.5} />
            START NEW MATCH
          </button>
          <button onClick={() => navigate('/home/support')} className="w-full flex items-center px-3 py-2 text-[#d1d9e0] hover:text-white transition-colors">
            <HelpCircle className="mr-3 h-5 w-5 opacity-80" strokeWidth={1.5} />
            <span className="text-[15px]">Support</span>
          </button>
          <button onClick={() => {
            dispatch(removeUser());
            navigate('/login');
          }} className="w-full flex items-center px-3 py-2 text-[#d1d9e0] hover:text-white transition-colors">
            <LogOut className="mr-3 h-5 w-5 opacity-80" strokeWidth={1.5} />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
