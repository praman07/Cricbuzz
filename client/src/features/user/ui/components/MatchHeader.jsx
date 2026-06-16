const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

export const MatchHeader = ({
  matchInfo,
  currentScore,
  playingXI = null,
  battingPlayers = [],
  bowlingPlayer = null,
}) => {
  const status = String(matchInfo?.status || "UPCOMING");
  const battingTeamId = normalizeId(currentScore?.battingTeam?._id || currentScore?.battingTeam);
  const team1Id = normalizeId(matchInfo?.team1?._id);
  const team2Id = normalizeId(matchInfo?.team2?._id);
  const battingLabel =
    battingTeamId && battingTeamId === team1Id
      ? `${matchInfo?.team1?.name || "Team 1"} batting`
      : battingTeamId && battingTeamId === team2Id
        ? `${matchInfo?.team2?.name || "Team 2"} batting`
        : "Awaiting innings";

  const currentBatters = battingPlayers.length
    ? battingPlayers
    : (() => {
    if (!playingXI) return [];
    if (battingTeamId === team1Id) return (playingXI.team1 || []).slice(0, 2);
    if (battingTeamId === team2Id) return (playingXI.team2 || []).slice(0, 2);
    return [];
  })();

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="h-1 bg-green-700" />

      <div className="grid grid-cols-3 items-center px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border bg-slate-50 flex items-center justify-center font-bold text-slate-700">
            {matchInfo?.team1?.shortName || "T1"}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">{matchInfo?.team1?.name || "Team 1"}</h3>
            <p className="text-sm text-slate-500">{battingTeamId === team1Id ? "Batting" : "Fielding"}</p>
          </div>
        </div>

        <div className="text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {status}
          </span>

          <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900">
            {currentScore?.score || 0}/{currentScore?.wickets || 0}
          </h1>

          <p className="mt-1 text-sm text-slate-500">{currentScore?.overs || "0.0"} Overs</p>
          <p className="mt-1 text-sm font-medium text-slate-700">CRR: {Number(currentScore?.runRate || 0).toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <h3 className="text-xl font-semibold text-slate-900">{matchInfo?.team2?.name || "Team 2"}</h3>
            <p className="text-sm text-slate-500">{battingTeamId === team2Id ? "Batting" : "Fielding"}</p>
          </div>

          <div className="w-12 h-12 rounded-lg border bg-slate-50 flex items-center justify-center font-bold text-slate-700">
            {matchInfo?.team2?.shortName || "T2"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3 text-sm">
        <div className="flex gap-6">
          {currentBatters.length ? (
            currentBatters.map((entry) => (
              <span key={entry?._id || entry?.player?._id || entry?.name || entry?.player?.name}>
                <strong>{entry?.name || entry?.player?.name || "Player"}</strong>
              </span>
            ))
          ) : (
            <span>{battingLabel}</span>
          )}
        </div>

        <div className="text-right">
          <p>
            <strong>Bowler:</strong> {bowlingPlayer?.name || "TBA"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            <strong>Venue:</strong> {matchInfo?.venue || "TBA"}
          </p>
        </div>
      </div>
    </div>
  );
};