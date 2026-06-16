import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

export const LiveMatchCard = ({ match }) => {
  const score = match?.latestScore;
  const battingTeamId = normalizeId(score?.battingTeam?._id || score?.battingTeam);
  const team1Id = normalizeId(match?.team1?._id);
  const team2Id = normalizeId(match?.team2?._id);

  const team1Score =
    battingTeamId === team1Id
      ? `${score?.score || 0}/${score?.wickets || 0} (${score?.overs || "0.0"})`
      : "Yet to bat";
  const team2Score =
    battingTeamId === team2Id
      ? `${score?.score || 0}/${score?.wickets || 0} (${score?.overs || "0.0"})`
      : "Yet to bat";

  return (
    <div className="bg-white border rounded-md overflow-hidden">
      <div className="h-1 bg-green-700" />

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[11px] uppercase font-semibold tracking-wide text-gray-500">
            {match?.seriesId?.name || "Live Match"}
          </p>

          <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded">
            {match?.status || "LIVE"}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
                {match?.team1?.shortName || "T1"}
              </div>

              <span className="text-lg">{match?.team1?.name || "Team 1"}</span>
            </div>

            <div className="font-bold text-lg text-slate-900">{team1Score}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                {match?.team2?.shortName || "T2"}
              </div>

              <span className="text-lg text-gray-600">{match?.team2?.name || "Team 2"}</span>
            </div>

            <span className="text-sm text-gray-600">{team2Score}</span>
          </div>
        </div>

        <div className="border-t my-4" />

        <div className="flex justify-between items-center">
          <p className="text-sm italic text-green-900">
            {match?.latestCommentary || match?.result || "Live updates available"}
          </p>

          <Link to={`/matches/${match?._id}`} className="flex items-center gap-1 text-green-800 text-sm">
            Open Scoreboard
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
