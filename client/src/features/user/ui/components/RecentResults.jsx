import { ResultCard } from "./ResultCard";

export const RecentResults = ({ matches = [], isLoading = false }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Results</h2>
          <p className="text-sm text-gray-500">Latest completed matches</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border rounded-md p-6 text-sm font-semibold text-slate-500">
          Loading recent results...
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white border rounded-md p-6 text-sm font-semibold text-slate-500">
          No completed matches yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {matches.map((match) => (
            <ResultCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
};
