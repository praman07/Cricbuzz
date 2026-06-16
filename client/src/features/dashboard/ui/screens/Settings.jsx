import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Save, LifeBuoy } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSupportInfo } from '../../state/settingsSlice';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { employee } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const [supportData, setSupportData] = useState({
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    operatingHours: settings.operatingHours,
    faqLink: settings.faqLink
  });

  const handleSupportSave = () => {
    dispatch(updateSupportInfo(supportData));
    alert('Support settings saved successfully!');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6 pb-6 border-b border-slate-100">
              <div className="relative">
                <img src={employee?.picture || `https://ui-avatars.com/api/?name=${employee?.name}&background=1E402F&color=fff`} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                <button className="absolute bottom-0 right-0 bg-white border border-slate-200 text-slate-600 rounded-full p-1.5 shadow-sm hover:text-[#2ebd4f]">
                   <User size={14} />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{employee?.name || 'Administrator'}</h3>
                <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">{employee?.role || 'SUPER_ADMIN'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">Full Name</label>
                <input type="text" defaultValue={employee?.name} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm font-bold text-slate-800 outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">Email Address</label>
                <input type="email" defaultValue={employee?.email} disabled className="w-full px-4 py-2.5 bg-[#f1f5f9] border border-slate-200 rounded-md text-sm font-bold text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">Timezone</label>
                <select className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm font-bold text-slate-800 outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]">
                  <option>UTC+05:30 (India Standard Time)</option>
                  <option>UTC+00:00 (Greenwich Mean Time)</option>
                  <option>UTC-05:00 (Eastern Standard Time)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => alert('Profile details saved successfully!')} className="flex items-center px-5 py-2.5 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors">
                <Save size={16} className="mr-2" /> Save Profile
              </button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Password & Authentication</h3>
            
            <div className="max-w-md space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-start">
              <button onClick={() => alert('Password updated successfully!')} className="flex items-center px-5 py-2.5 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors">
                Update Password
              </button>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">System Notifications</h3>
            
            <div className="space-y-4">
               {[
                 { id: 'n1', title: 'Match Start Alerts', desc: 'Get notified when a new match begins.', checked: true },
                 { id: 'n2', title: 'Critical System Logs', desc: 'Receive emails for high severity audit events.', checked: true },
                 { id: 'n3', title: 'New Admin Registrations', desc: 'Alert when a new administrator is added.', checked: false },
               ].map((pref) => (
                 <div key={pref.id} className="flex items-start">
                   <div className="flex items-center h-5 mt-1">
                     <input id={pref.id} type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 text-[#2ebd4f] border-slate-300 rounded focus:ring-[#2ebd4f]" />
                   </div>
                   <div className="ml-3">
                     <label htmlFor={pref.id} className="text-sm font-bold text-slate-800">{pref.title}</label>
                     <p className="text-xs text-slate-500 font-medium">{pref.desc}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-start">
              <button onClick={() => alert('Preferences saved successfully!')} className="flex items-center px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-md shadow-sm transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        );
      case 'platform':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Platform Support Settings</h3>
            <p className="text-[14px] text-slate-600 mb-4">Update the support contact information displayed to users and other admins on the Support page.</p>
            
            <div className="max-w-xl space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2">Support Email</label>
                  <input type="email" value={supportData.supportEmail} onChange={(e) => setSupportData({...supportData, supportEmail: e.target.value})} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm font-bold text-slate-800 outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2">Support Phone</label>
                  <input type="text" value={supportData.supportPhone} onChange={(e) => setSupportData({...supportData, supportPhone: e.target.value})} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm font-bold text-slate-800 outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">Operating Hours</label>
                <input type="text" value={supportData.operatingHours} onChange={(e) => setSupportData({...supportData, operatingHours: e.target.value})} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm font-bold text-slate-800 outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-600 mb-2">FAQ Documentation Link</label>
                <input type="url" value={supportData.faqLink} onChange={(e) => setSupportData({...supportData, faqLink: e.target.value})} className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-md text-sm font-bold text-slate-800 outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-start">
              <button onClick={handleSupportSave} className="flex items-center px-5 py-2.5 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors">
                <Save size={16} className="mr-2" /> Save Support Info
              </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Account Settings</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Preferences</h2>
          <p className="text-[15px] text-slate-600 mt-1">Manage your account profile and system configurations.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] flex flex-col md:flex-row overflow-hidden min-h-[60vh]">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-[#f8fafc] border-r border-[#e5e7eb] p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-md transition-colors ${activeTab === 'profile' ? 'bg-white text-[#1E402F] shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <User size={16} className="mr-3" /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('platform')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-md transition-colors ${activeTab === 'platform' ? 'bg-white text-[#1E402F] shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <LifeBuoy size={16} className="mr-3" /> Platform Support
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8 md:p-12">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default Settings;
