const inningsRowsFromScores = (scores = []) =>
  scores
    .filter(Boolean)
    .map((score) => ({
      innings: score?.innings || 1,
      team: score?.battingTeam?.name || score?.battingTeam?.shortName || "Unknown Team",
      score: `${score?.score || 0}/${score?.wickets || 0}`,
      overs: score?.overs || "0.0",
      runRate: Number(score?.runRate || 0).toFixed(2),
      target: score?.target ?? "-",
    }))
    .sort((a, b) => a.innings - b.innings);

export const ScorecardTable = ({ innings1, innings2 }) => {
  const rows = inningsRowsFromScores([innings1, innings2]);

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="border-b px-6 py-5">
        <h2 className="text-2xl font-semibold text-slate-900">Innings Summary</h2>
      </div>

      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="w-[12%] px-6 py-3 text-left font-medium">Inns</th>
            <th className="w-[28%] py-3 text-left font-medium">Team</th>
            <th className="w-[14%] py-3 text-center font-medium">Score</th>
            <th className="w-[14%] py-3 text-center font-medium">Overs</th>
            <th className="w-[14%] py-3 text-center font-medium">Run Rate</th>
            <th className="w-[18%] py-3 text-center font-medium">Target</th>
          </tr>
        </thead>

        <tbody>
          {rows.length ? (
            rows.map((row) => (
              <tr key={`${row.team}-${row.innings}`} className="border-t transition hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{row.innings}</td>
                <td className="py-4 text-slate-800">{row.team}</td>
                <td className="py-4 text-center font-semibold text-slate-900">{row.score}</td>
                <td className="py-4 text-center text-slate-700">{row.overs}</td>
                <td className="py-4 text-center text-slate-700">{row.runRate}</td>
                <td className="py-4 text-center text-slate-700">{row.target}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-6 text-sm font-semibold text-slate-500 text-center">
                Scorecard is not available yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};