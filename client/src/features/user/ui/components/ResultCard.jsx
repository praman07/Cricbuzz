import { Link } from "react-router-dom";

export const ResultCard = ({ match }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase">
          {match?.seriesId?.name || "Series"}
        </span>

        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
          Completed
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
            {match?.team1?.shortName || "T1"}
          </div>

          <span className="font-medium text-gray-800">{match?.team1?.name || "Team 1"}</span>
        </div>

        <span className="font-semibold text-gray-900">-</span>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
            {match?.team2?.shortName || "T2"}
          </div>

          <span className="font-medium text-gray-800">{match?.team2?.name || "Team 2"}</span>
        </div>

        <span className="font-semibold text-gray-900">-</span>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-green-700">{match?.result || "Result updated soon"}</p>
        <Link to={`/matches/${match?._id}`} className="text-sm text-green-700 hover:underline mt-2 inline-block">
          Open Match Center
        </Link>
      </div>
    </div>
  );
};
