import { UpcomingMatchCard } from "./UpcomingMatchCard";

const upcomingMatches = [
  {
    id: 1,
    series: "T20 World Cup",
    date: "22 Jan, 7:30 PM",
    team1Code: "IND",
    team1: "India",
    team2Code: "PAK",
    team2: "Pakistan",
    venue: "Melbourne Cricket Ground",
  },
  {
    id: 2,
    series: "ODI Series",
    date: "24 Jan, 2:00 PM",
    team1Code: "AUS",
    team1: "Australia",
    team2Code: "ENG",
    team2: "England",
    venue: "Sydney Cricket Ground",
  },
];

export const UpcomingMatches = () => {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Upcoming Matches
        </h2>

        <button className="text-sm font-medium text-green-700 hover:text-green-800 transition">
          View Schedule
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {upcomingMatches.map((match) => (
          <UpcomingMatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
};
