export const MatchSidebar = () => {
  const deliveries = ["1", "1", "4", "0", "W", "6"];

  return (
    <div className="space-y-4">
      {/* Recent Deliveries */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b bg-slate-50">
          <h3 className="font-semibold text-slate-900">Recent Deliveries</h3>
        </div>

        <div className="p-4 flex flex-wrap gap-2">
          {deliveries.map((ball, index) => (
            <div
              key={index}
              className={`
                  w-10 h-10 rounded-full border flex items-center justify-center
                  text-sm font-medium transition
                  ${
                    ball === "4"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : ball === "6"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : ball === "W"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-slate-300 text-slate-700"
                  }
                `}
            >
              {ball}
            </div>
          ))}
        </div>
      </div>

      {/* Match Predictor */}
      <div className="bg-slate-900 rounded-lg p-5 text-white">
        <h3 className="text-xl font-semibold">Match Predictor</h3>

        <p className="mt-2 text-sm text-slate-300">
          Thunderbolts win probability
        </p>

        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-[78%] bg-green-500 rounded-full" />
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-slate-300">Thunderbolts</span>

          <span className="text-lg font-bold text-green-400">78%</span>
        </div>
      </div>
    </div>
  );
};
