import { LiveMatches } from "../components/LiveMatches";
import { RecentResults } from "../components/RecentResults";
import { TrendingNews } from "../components/TrendingNews";
import { UpcomingMatches } from "../components/UpcomingMatches";

export const UserHome = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Live Matches + News */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <LiveMatches />
          <TrendingNews />
        </div>

        {/* Upcoming Matches */}
        <div className="mt-8">
          <UpcomingMatches />
        </div>

        {/* Recent Results */}
        <div className="mt-8">
          <RecentResults />
        </div>
      </div>
    </main>
  );
};
