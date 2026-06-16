import React, { useEffect, useMemo, useState } from "react";
import KPICard from "../components/KPICard";
import StatusBadge from "../components/StatusBadge";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatches } from "../../state/matchSlice";
import ScheduleMatchModal from "../components/ScheduleMatchModal";

const LIVE_STATUSES = new Set(["LIVE", "INNINGS_BREAK"]);
const UPCOMING_STATUSES = new Set([
  "DRAFT",
  "UPCOMING",
  "TOSS_COMPLETED",
  "PLAYING_XI_SELECTED",
]);

const normalizeStatus = (status) => String(status || "").toUpperCase();

const mapMatchStatus = (status) => {
  const normalizedStatus = normalizeStatus(status);

  if (LIVE_STATUSES.has(normalizedStatus)) return "Live";
  if (normalizedStatus === "COMPLETED") return "Completed";
  if (UPCOMING_STATUSES.has(normalizedStatus)) return "Scheduled";

  return "Pending";
};

const Schedule = () => {
  const dispatch = useDispatch();
  const { matches, isLoading } = useSelector((state) => state.match);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const liveCount = useMemo(
    () => matches.filter((match) => LIVE_STATUSES.has(normalizeStatus(match.status))).length,
    [matches],
  );

  const upcomingMatches = useMemo(
    () =>
      matches
        .filter((match) => UPCOMING_STATUSES.has(normalizeStatus(match.status)))
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [matches],
  );

  const completedCount = useMemo(
    () => matches.filter((match) => normalizeStatus(match.status) === "COMPLETED").length,
    [matches],
  );

  const uniqueVenueCount = useMemo(
    () => new Set(matches.map((match) => match.venue).filter(Boolean)).size,
    [matches],
  );

  const nextMatch = upcomingMatches[0] || null;

  const nextVenueMatchCount = useMemo(() => {
    if (!nextMatch?.venue) return 0;

    const targetVenue = nextMatch.venue.trim().toLowerCase();
    return matches.filter((match) => (match.venue || "").trim().toLowerCase() === targetVenue).length;
  }, [matches, nextMatch]);

  const venueShare = matches.length
    ? Math.round((nextVenueMatchCount / matches.length) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {isModalOpen && (
        <ScheduleMatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Match Scheduling</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
            Master Schedule
          </h2>
          <p className="text-[15px] text-slate-600 mt-1">
            Manage and coordinate all upcoming domestic and international
            fixtures.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-5 py-3 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors tracking-wide"
        >
          <Plus size={18} className="mr-2" strokeWidth={2.5} />
          Schedule New Match
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Fixtures"
          value={matches.length}
          icon={CalendarIcon}
          badgeText={`${upcomingMatches.length} upcoming`}
          badgeColor="bg-[#e0e7ff] text-[#4f46e5]"
        />
        <KPICard
          title="Live Now"
          value={liveCount}
          icon={Clock}
          badgeText={liveCount > 0 ? "Currently Scoring" : "No Live Matches"}
          badgeColor="text-[#d32f2f] bg-transparent p-0"
        />
        <KPICard
          title="Completed"
          value={completedCount}
          icon={CheckCircle}
          badgeText={`${matches.length - completedCount} remaining`}
          badgeColor="bg-[#f1f5f9] text-slate-600"
        />
        <KPICard
          title="Venues Active"
          value={uniqueVenueCount}
          icon={MapPin}
          badgeText={nextMatch?.venue ? `Next: ${nextMatch.venue}` : "No upcoming venue"}
          badgeColor="bg-[#e7f9eb] text-[#15803d]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="p-5 border-b border-[#e5e7eb]">
            <h3 className="text-[16px] font-bold text-slate-800">
              Upcoming Fixtures
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e5e7eb]">
                  <th className="py-4 px-6 text-[13px] font-bold text-slate-700">
                    Match Details
                  </th>
                  <th className="py-4 px-6 text-[13px] font-bold text-slate-700">
                    Venue / Format
                  </th>
                  <th className="py-4 px-6 text-[13px] font-bold text-slate-700 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-8 text-center text-slate-500 font-bold"
                    >
                      Loading matches...
                    </td>
                  </tr>
                ) : upcomingMatches.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-8 text-center text-slate-500 font-bold"
                    >
                      No upcoming matches scheduled.
                    </td>
                  </tr>
                ) : (
                  upcomingMatches.map((match) => (
                    <tr
                      key={match._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-5 px-6">
                        <p className="font-bold text-[15px] text-[#1E402F] tracking-wide">
                          {match.team1?.shortName || "TBA"} vs{" "}
                          {match.team2?.shortName || "TBA"}
                        </p>
                        <p className="text-[13px] font-medium text-slate-500 mt-1 flex items-center">
                          <Clock size={14} className="mr-1.5 opacity-70" />
                          {new Date(
                            match.startTime,
                          ).toLocaleDateString()} •{" "}
                          {new Date(match.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="py-5 px-6">
                        <p className="font-bold text-[14px] text-slate-700">
                          {match.venue || "TBA"}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] text-slate-600 text-[11px] rounded font-bold uppercase tracking-wider">
                          {match.seriesId?.name || "Series TBA"}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <StatusBadge status={mapMatchStatus(match.status)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
            <h3 className="text-[16px] font-bold text-slate-800 mb-5">
              Next Major Venue
            </h3>
            {nextMatch ? (
              <>
                <div className="h-44 rounded-md mb-5 border border-[#dbe7f1] bg-linear-to-br from-[#f8fbff] to-[#eef6ff] flex items-center justify-center">
                  <div className="text-center px-3">
                    <MapPin size={22} className="mx-auto text-[#1E402F] mb-2" />
                    <p className="text-sm font-bold text-slate-700">
                      {nextMatch.team1?.shortName || "TBA"} vs{" "}
                      {nextMatch.team2?.shortName || "TBA"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(nextMatch.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <h4 className="font-bold text-[16px] text-slate-900">
                  {nextMatch.venue || "Venue TBA"}
                </h4>
                <div className="mt-4">
                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="text-slate-500 font-bold">Venue Share</span>
                    <span className="text-slate-800 font-bold tracking-wide">
                      {nextVenueMatchCount} / {matches.length || 0} fixtures
                    </span>
                  </div>
                  <div className="w-full bg-[#f1f5f9] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#2ebd4f] h-full rounded-full transition-all"
                      style={{ width: `${venueShare}%` }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-44 rounded-md border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-500">
                No upcoming venue data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
