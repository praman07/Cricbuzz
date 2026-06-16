import { ResultCard } from "./ResultCard";

const resultsData = [
  {
    id: 1,
    series: "IPL 2025 - Final",
    team1Code: "RCB",
    team1: "Royal Challengers Bengaluru",
    team1Score: "190/9",

    team2Code: "PBKS",
    team2: "Punjab Kings",
    team2Score: "184/7",

    result: "RCB won by 6 runs",
  },
  {
    id: 2,
    series: "WTC Final",
    team1Code: "AUS",
    team1: "Australia",
    team1Score: "295 & 207",

    team2Code: "SA",
    team2: "South Africa",
    team2Score: "281 & 213",

    result: "South Africa won by 5 wickets",
  },
  {
    id: 3,
    series: "T20I Series",
    team1Code: "IND",
    team1: "India",
    team1Score: "178/6",

    team2Code: "ENG",
    team2: "England",
    team2Score: "165/8",

    result: "India won by 13 runs",
  },
];

export const RecentResults = () => {
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Results</h2>

          <p className="text-sm text-gray-500">Latest completed matches</p>
        </div>

        <button className="text-green-600 font-medium hover:underline">
          View All Results →
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {resultsData.map((match) => (
          <ResultCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
};
