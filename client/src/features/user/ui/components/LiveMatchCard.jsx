import { ChevronRight } from "lucide-react";

export const LiveMatchCard = () => {
  return (
    <div className="bg-white border rounded-md overflow-hidden">
      <div className="h-1 bg-green-700" />

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-[11px] uppercase font-semibold tracking-wide text-gray-500">
            T20 World Series • Group A
          </p>

          <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded">
            LIVE
          </span>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
                IND
              </div>

              <span className="text-lg">India</span>
            </div>

            <div className="font-bold text-2xl">
              184/4
              <span className="text-sm text-gray-500 ml-1">(18.2)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                AUS
              </div>

              <span className="text-lg text-gray-500">Australia</span>
            </div>

            <span className="text-sm text-gray-600">Yet to bat</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-4" />

        {/* Footer */}
        <div className="flex justify-between items-center">
          <p className="text-sm italic text-green-900">
            Kohli 74*(42), Sharma 55(31)
          </p>

          <button className="flex items-center gap-1 text-green-800 text-sm">
            Open Scoreboard
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
