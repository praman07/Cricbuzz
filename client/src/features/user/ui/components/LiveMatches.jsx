import { LiveMatchCard } from "./LiveMatchCard";

export const LiveMatches = ({ matches = [], isLoading = false }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <h2 className="text-xl font-semibold text-slate-900">Live Now</h2>
        </div>
        <p className="text-sm font-medium text-slate-500">{matches.length} active</p>
      </div>

      {isLoading ? (
        <div className="bg-white border rounded-md p-6 text-sm font-semibold text-slate-500">
          Loading live matches...
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white border rounded-md p-6 text-sm font-semibold text-slate-500">
          No live matches at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {matches.map((match) => (
            <LiveMatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
};