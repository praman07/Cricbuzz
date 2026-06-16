import { NewsCard } from "./NewsCard";

const newsData = [
  {
    id: 1,
    title: "Selectors Weigh-In on Mid-Season Captaincy Shuffle",
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
    time: "12 mins ago",
  },
  {
    id: 2,
    title: "Rain Delays in Brisbane: Impact on Play-Off Brackets",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "Tech Spotlight: New DRS Algorithms for Upcoming Series",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    time: "3 hours ago",
  },
];

export const TrendingNews = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-slate-900">
          Trending News
        </h2>

        <button className="text-sm text-green-700 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {newsData.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      <button className="mt-4 text-sm text-green-700 hover:underline">
        Read More News →
      </button>
    </div>
  );
};