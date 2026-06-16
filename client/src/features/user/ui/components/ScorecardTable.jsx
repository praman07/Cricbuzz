export const ScorecardTable = () => {
  const batters = [
    {
      name: "V. Kohli*",
      status: "batting",
      runs: 74,
      balls: 42,
      fours: 8,
      sixes: 3,
      sr: "176.19",
    },
    {
      name: "G. Maxwell",
      status: "batting",
      runs: 12,
      balls: 8,
      fours: 1,
      sixes: 1,
      sr: "150.00",
    },
    {
      name: "F. du Plessis",
      status: "c Smith b Khan",
      runs: 45,
      balls: 28,
      fours: 4,
      sixes: 2,
      sr: "160.71",
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      {/* Innings Header */}
      <div className="border-b px-6 py-5">
        <h2 className="text-2xl font-semibold text-slate-900">
          Thunderbolts Innings
        </h2>
      </div>

      {/* Scorecard Table */}
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="w-[45%] px-6 py-3 text-left font-medium">Batter</th>
            <th className="w-[11%] py-3 text-center font-medium">R</th>
            <th className="w-[11%] py-3 text-center font-medium">B</th>
            <th className="w-[11%] py-3 text-center font-medium">4s</th>
            <th className="w-[11%] py-3 text-center font-medium">6s</th>
            <th className="w-[11%] py-3 text-center font-medium">SR</th>
          </tr>
        </thead>

        <tbody>
          {batters.map((batter) => (
            <tr
              key={batter.name}
              className="border-t transition hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-900">
                  {batter.name}
                </div>
                <div className="text-xs text-slate-500">{batter.status}</div>
              </td>

              <td className="py-4 text-center font-semibold">{batter.runs}</td>
              <td className="py-4 text-center">{batter.balls}</td>
              <td className="py-4 text-center">{batter.fours}</td>
              <td className="py-4 text-center">{batter.sixes}</td>
              <td className="py-4 text-center">{batter.sr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
