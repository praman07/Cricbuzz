const getBallStyle = (ball) => {
  if (ball === "4" || ball === "6") return "border-green-500 bg-green-50 text-green-700";
  if (ball === "W") return "border-red-500 bg-red-50 text-red-700";
  return "border-slate-300 text-slate-700";
};

export const MatchSidebar = ({ deliveries = [], winProbability = 50, favoredTeam = "Home Team" }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b bg-slate-50">
          <h3 className="font-semibold text-slate-900">Recent Deliveries</h3>
        </div>

        <div className="p-4 flex flex-wrap gap-2">
          {deliveries.length ? (
            deliveries.map((ball, index) => (
              <div
                key={`${ball}-${index}`}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-medium transition ${getBallStyle(ball)}`}
              >
                {ball}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 font-medium">No deliveries yet.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg p-5 text-white">
        <h3 className="text-xl font-semibold">Match Predictor</h3>

        <p className="mt-2 text-sm text-slate-300">
          {favoredTeam} win probability
        </p>

        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${winProbability}%` }} />
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-slate-300">{favoredTeam}</span>

          <span className="text-lg font-bold text-green-400">{winProbability}%</span>
        </div>
      </div>
    </div>
  );
};
