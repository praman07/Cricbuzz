import { NewsCard } from "./NewsCard";

export const TrendingNews = ({ items = [], isLoading = false }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-slate-900">Live Updates</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500 font-medium">Loading updates...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500 font-medium">No live updates available.</p>
      ) : (
        <div className="space-y-3">
          {items.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
};