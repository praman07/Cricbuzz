export const ResultCard = ({ match }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      {/* Series */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase">
          {match.series}
        </span>

        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
          Completed
        </span>
      </div>

      {/* Team 1 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
            {match.team1Code}
          </div>

          <span className="font-medium text-gray-800">{match.team1}</span>
        </div>

        <span className="font-semibold text-gray-900">{match.team1Score}</span>
      </div>

      {/* Team 2 */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
            {match.team2Code}
          </div>

          <span className="font-medium text-gray-800">{match.team2}</span>
        </div>

        <span className="font-semibold text-gray-900">{match.team2Score}</span>
      </div>

      {/* Result */}
      <div className="mt-4">
        <p className="text-sm font-medium text-green-700">{match.result}</p>
      </div>
    </div>
  );
};
