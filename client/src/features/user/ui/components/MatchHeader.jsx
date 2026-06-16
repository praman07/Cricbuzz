export const MatchHeader = () => {
    return (
      <div className="overflow-hidden rounded-lg border bg-white">
        {/* Top Match Status Line */}
        <div className="h-1 bg-green-700" />
  
        {/* Main Header */}
        <div className="grid grid-cols-3 items-center px-6 py-5">
          {/* Team 1 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border bg-slate-50 flex items-center justify-center">
              🦅
            </div>
  
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Thunderbolts
              </h3>
  
              <p className="text-sm text-slate-500">
                Opted to bat
              </p>
            </div>
          </div>
  
          {/* Score */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              LIVE
            </span>
  
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900">
              184/4
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              16.4 Overs
            </p>
  
            <p className="mt-1 text-sm font-medium text-slate-700">
              CRR: 11.04
            </p>
          </div>
  
          {/* Team 2 */}
          <div className="flex items-center justify-end gap-3">
            <div className="text-right">
              <h3 className="text-xl font-semibold text-slate-900">
                Strikers
              </h3>
  
              <p className="text-sm text-slate-500">
                Yet to bat
              </p>
            </div>
  
            <div className="w-12 h-12 rounded-lg border bg-slate-50 flex items-center justify-center">
              🛡️
            </div>
          </div>
        </div>
  
        {/* Current Players */}
        <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3 text-sm">
          <div className="flex gap-6">
            <span>
              <strong>V. Kohli*</strong> 74 (42)
            </span>
  
            <span>
              <strong>G. Maxwell</strong> 12 (8)
            </span>
          </div>
  
          <div>
            <strong>Bowler:</strong> R. Khan &nbsp;
            <strong>2.4-0-28-1</strong>
          </div>
        </div>
      </div>
    );
  };