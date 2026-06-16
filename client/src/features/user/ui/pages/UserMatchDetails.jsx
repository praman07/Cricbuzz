import { MatchHeader } from "../components/MatchHeader";
import { MatchTabs } from "../components/MatchTabs";
import { ScorecardTable } from "../components/ScorecardTable";
import { MatchSidebar } from "../components/MatchSidebar";
export const UserMatchDetails = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <MatchHeader />

      <div className="grid lg:grid-cols-[1fr_300px] gap-4 mt-4">
        <div>
          <MatchTabs />
          <ScorecardTable />
        </div>

        <MatchSidebar />
      </div>
    </div>
  );
};
