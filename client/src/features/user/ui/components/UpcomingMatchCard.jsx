export const UpcomingMatchCard = () => {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        {/* Date */}
        <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-400">
          Sunday, 14 Oct • 14:30
        </p>
  
        {/* Teams */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center font-semibold text-slate-800 mx-auto">
              RSA
            </div>
  
            <p className="mt-2 text-sm text-slate-700">
              South Africa
            </p>
          </div>
  
          <span className="text-slate-300 font-semibold">
            VS
          </span>
  
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center font-semibold text-green-800 mx-auto">
              PAK
            </div>
  
            <p className="mt-2 text-sm text-slate-700">
              Pakistan
            </p>
          </div>
        </div>
  
        {/* Countdown */}
        <div className="flex justify-center mt-5">
          <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700">
            Starts in 04:22:15
          </span>
        </div>
  
        {/* Button */}
        <button className="w-full mt-5 border border-slate-300 py-2 rounded-md text-slate-700 hover:bg-slate-50 transition">
          Notify Me
        </button>
      </div>
    );
  };
  