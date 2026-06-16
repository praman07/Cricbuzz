import { LiveMatchCard } from "./LiveMatchCard";

const liveMatches = [
  { id: 1 },
  { id: 2 },
];

export const LiveMatches = () => {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>

          <h2 className="text-xl font-semibold text-slate-900">
            Live Now
          </h2>
        </div>

        <button className="text-sm font-medium text-green-700 hover:text-green-800 transition">
          View All Matches
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {liveMatches.map((match) => (
          <LiveMatchCard key={match.id} />
        ))}
      </div>
    </section>
  );
};