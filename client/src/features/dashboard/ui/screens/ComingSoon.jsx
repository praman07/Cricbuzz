import React from 'react';

const ComingSoon = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Coming Soon</h2>
      <p className="text-[15px] text-slate-600 text-center max-w-md">
        This administration module is currently under development and will be available in a future update.
      </p>
    </div>
  );
};

export default ComingSoon;
