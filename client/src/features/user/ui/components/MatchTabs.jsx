const TABS = [
  { id: "scorecard", label: "Scorecard" },
  { id: "commentary", label: "Commentary" },
  { id: "details", label: "Match Details" },
];

export const MatchTabs = ({ activeTab, onChange }) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="flex items-center border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-3 text-sm transition ${
              activeTab === tab.id
                ? "font-semibold text-green-700 border-b-2 border-green-700 bg-green-50"
                : "font-medium text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
