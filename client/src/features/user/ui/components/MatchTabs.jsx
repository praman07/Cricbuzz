export const MatchTabs = () => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="flex items-center border-b">
        {/* Active Tab */}
        <button className="px-5 py-3 text-sm font-semibold text-green-700 border-b-2 border-green-700 bg-green-50">
          Scorecard
        </button>

        {/* Inactive Tabs */}
        <button className="px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition">
          Commentary
        </button>

        <button className="px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition">
          Match Details
        </button>
      </div>
    </div>
  );
};
