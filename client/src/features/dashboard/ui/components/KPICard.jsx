import React from 'react';

const KPICard = ({ title, value, subtitle, icon: Icon, badgeText, badgeColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6 flex flex-col relative overflow-hidden transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[13px] font-bold text-slate-800">{title}</h3>
        {Icon && <Icon size={18} className="text-[#1E402F]" strokeWidth={2} />}
      </div>
      
      <div className="flex items-end mb-2">
        <p className="text-[44px] font-bold text-slate-900 leading-none tracking-tight">{value}</p>
      </div>

      {subtitle && (
        <p className="text-[13px] text-slate-500 mt-2 font-medium">{subtitle}</p>
      )}

      {badgeText && (
        <div className="mt-4">
          <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${badgeColor}`}>
            {badgeText === 'Currently Scoring' && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
            )}
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
