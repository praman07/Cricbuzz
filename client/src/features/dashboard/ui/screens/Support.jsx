import React from 'react';
import { Mail, Phone, Clock, FileText, HelpCircle, ExternalLink } from 'lucide-react';
import { useSelector } from 'react-redux';

const Support = () => {
  const settings = useSelector((state) => state.settings);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Help Center</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Support</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Admin Support</h2>
          <p className="text-[15px] text-slate-600 mt-1">Get help and contact the platform support team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#e7f9eb] flex items-center justify-center mr-4">
               <HelpCircle size={24} className="text-[#2ebd4f]" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-900">Contact Support</h3>
          </div>
          
          <p className="text-slate-600 font-medium mb-8">
            If you are experiencing issues with the scoring panel or administrative tools, please reach out using the contact methods below.
          </p>

          <div className="space-y-6">
             <div className="flex items-start">
                <Mail className="mt-1 mr-4 text-slate-400" size={20} />
                <div>
                   <h4 className="text-sm font-bold text-slate-900">Email Address</h4>
                   <p className="text-[15px] text-[#15803d] font-bold mt-1">{settings.supportEmail}</p>
                </div>
             </div>
             <div className="flex items-start">
                <Phone className="mt-1 mr-4 text-slate-400" size={20} />
                <div>
                   <h4 className="text-sm font-bold text-slate-900">Phone Support</h4>
                   <p className="text-[15px] text-[#15803d] font-bold mt-1">{settings.supportPhone}</p>
                </div>
             </div>
             <div className="flex items-start">
                <Clock className="mt-1 mr-4 text-slate-400" size={20} />
                <div>
                   <h4 className="text-sm font-bold text-slate-900">Operating Hours</h4>
                   <p className="text-[15px] text-slate-600 font-medium mt-1">{settings.operatingHours}</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
