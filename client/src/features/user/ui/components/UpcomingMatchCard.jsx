import { Link } from "react-router-dom";

const getCountdownLabel = (startTime) => {
  if (!startTime) return "Schedule pending";

  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return "Starting soon";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `Starts in ${hours}h ${minutes}m`;
};

export const UpcomingMatchCard = ({ match }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        {new Date(match?.startTime).toLocaleString()}
      </p>

      <div className="flex items-center justify-between mt-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center font-semibold text-slate-800 mx-auto">
            {match?.team1?.shortName || "T1"}
          </div>

          <p className="mt-2 text-sm text-slate-700">{match?.team1?.name || "Team 1"}</p>
        </div>

        <span className="text-slate-300 font-semibold">VS</span>

        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center font-semibold text-green-800 mx-auto">
            {match?.team2?.shortName || "T2"}
          </div>

          <p className="mt-2 text-sm text-slate-700">{match?.team2?.name || "Team 2"}</p>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <span className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700">
          {getCountdownLabel(match?.startTime)}
        </span>
      </div>

      <Link
        to={`/matches/${match?._id}`}
        className="w-full mt-5 border border-slate-300 py-2 rounded-md text-slate-700 hover:bg-slate-50 transition block text-center"
      >
        Match Center
      </Link>
    </div>
  );
};
  