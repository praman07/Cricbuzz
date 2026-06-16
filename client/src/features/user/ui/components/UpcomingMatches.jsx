import { UpcomingMatchCard } from "./UpcomingMatchCard";

export const UpcomingMatches = ({ matches = [], isLoading = false }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Upcoming Matches</h2>
        <p className="text-sm font-medium text-slate-500">{matches.length} fixtures</p>
      </div>

      {isLoading ? (
        <div className="bg-white border rounded-md p-6 text-sm font-semibold text-slate-500">
          Loading upcoming fixtures...
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white border rounded-md p-6 text-sm font-semibold text-slate-500">
          No upcoming matches.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {matches.map((match) => (
            <UpcomingMatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
};
