import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import axiosInstance from "../../../../config/axiosInstance";

const SOCKET_URL = axiosInstance.defaults.baseURL || "http://localhost:3000";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const getLatestScore = (scores = []) =>
  scores.reduce((latest, score) => {
    if (!latest) return score;
    return (score?.innings || 0) > (latest?.innings || 0) ? score : latest;
  }, null);

const formatCompactDateTime = (value) => {
  if (!value) return "TBA";
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const deriveLiveView = (match) => {
  if (!match) {
    return {
      team1Score: "Yet to bat",
      team2Score: "Yet to bat",
      overs: "0.0",
      currentBatters: [],
      lastHighlight: "-",
    };
  }

  const score = match.latestScore;
  const battingTeamId = normalizeId(score?.battingTeam?._id || score?.battingTeam);
  const team1Id = normalizeId(match?.team1?._id);
  const team2Id = normalizeId(match?.team2?._id);
  const fullScore = `${score?.score || 0}/${score?.wickets || 0}`;

  const team1Score = battingTeamId === team1Id ? fullScore : "Yet to bat";
  const team2Score = battingTeamId === team2Id ? fullScore : "Yet to bat";

  const battingXI =
    battingTeamId === team1Id
      ? match?.playingXI?.team1 || []
      : battingTeamId === team2Id
        ? match?.playingXI?.team2 || []
        : [];

  return {
    team1Score,
    team2Score,
    overs: score?.overs || "0.0",
    currentBatters: battingXI
      .slice(0, 2)
      .map((entry) => entry?.player?.name)
      .filter(Boolean),
    lastHighlight: match?.latestCommentary || "-",
  };
};

export const UserHome = () => {
  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feed, setFeed] = useState({
    liveMatches: [],
    upcomingMatches: [],
    recentMatches: [],
  });

  const loadHomeFeed = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError("");

    try {
      const homeResponse = await axiosInstance.get("/api/home");
      const data = homeResponse.data?.data || {};
      const liveMatches = Array.isArray(data.liveMatches) ? data.liveMatches : [];
      const upcomingMatches = Array.isArray(data.upcomingMatches) ? data.upcomingMatches : [];
      const recentMatches = Array.isArray(data.recentMatches) ? data.recentMatches : [];

      const enrichedLiveMatches = await Promise.all(
        liveMatches.map(async (match) => {
          const matchId = normalizeId(match._id);
          if (!matchId) return match;

          try {
            const [detailsResponse, commentaryResponse] = await Promise.all([
              axiosInstance.get(`/api/matches/${matchId}`),
              axiosInstance.get(`/api/matches/${matchId}/commentary?limit=1&page=1`),
            ]);

            const details = detailsResponse.data?.data || {};
            const latestCommentary = commentaryResponse.data?.data?.[0]?.text || "";

            return {
              ...match,
              latestScore: getLatestScore(details.scores || []),
              latestCommentary,
            };
          } catch {
            return match;
          }
        })
      );

      setFeed({
        liveMatches: enrichedLiveMatches,
        upcomingMatches,
        recentMatches,
      });
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Failed to load home feed");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeFeed(true);
  }, [loadHomeFeed]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadHomeFeed(false);
    }, 30000);
    return () => clearInterval(intervalId);
  }, [loadHomeFeed]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socket.on("connect_error", (socketError) => {
      setError(`Socket connection failed: ${socketError.message}`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return undefined;

    const roomIds = feed.liveMatches.map((match) => normalizeId(match._id)).filter(Boolean);
    const handleRealtimeUpdate = () => {
      loadHomeFeed(false);
    };

    roomIds.forEach((matchId) => socket.emit("join-match", matchId));

    socket.on("score.updated", handleRealtimeUpdate);
    socket.on("commentary.created", handleRealtimeUpdate);
    socket.on("match.started", handleRealtimeUpdate);
    socket.on("match.innings_break", handleRealtimeUpdate);
    socket.on("match.completed", handleRealtimeUpdate);
    socket.on("toss.updated", handleRealtimeUpdate);
    socket.on("playingXI.updated", handleRealtimeUpdate);

    return () => {
      roomIds.forEach((matchId) => socket.emit("leave-match", matchId));
      socket.off("score.updated", handleRealtimeUpdate);
      socket.off("commentary.created", handleRealtimeUpdate);
      socket.off("match.started", handleRealtimeUpdate);
      socket.off("match.innings_break", handleRealtimeUpdate);
      socket.off("match.completed", handleRealtimeUpdate);
      socket.off("toss.updated", handleRealtimeUpdate);
      socket.off("playingXI.updated", handleRealtimeUpdate);
    };
  }, [feed.liveMatches, loadHomeFeed]);

  const updateItems = useMemo(() => {
    const liveItems = feed.liveMatches.map((match) => ({
      id: `live-${match._id}`,
      title:
        match.latestCommentary ||
        `${match.team1?.shortName || "T1"} vs ${match.team2?.shortName || "T2"} is live`,
      time: new Date(match.startTime).toLocaleString(),
      category: match.seriesId?.name || "Live Match",
    }));

    const resultItems = feed.recentMatches.slice(0, 3).map((match) => ({
      id: `result-${match._id}`,
      title: match.result || `${match.team1?.name} vs ${match.team2?.name} completed`,
      time: new Date(match.startTime).toLocaleString(),
      category: "Result",
    }));

    return [...liveItems, ...resultItems].slice(0, 6);
  }, [feed.liveMatches, feed.recentMatches]);

  const featuredLiveMatch = feed.liveMatches[0] || null;
  const featuredLiveView = useMemo(
    () => deriveLiveView(featuredLiveMatch),
    [featuredLiveMatch],
  );
  const topUpcoming = feed.upcomingMatches.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#0f172a]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-[22px] tracking-tight text-[#0e4f2f]">
            CricManager
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/matches" className="text-[#0e4f2f] border-b-2 border-[#0e4f2f] pb-1">
              Live Matches
            </Link>
            <a href="#fixtures" className="hover:text-slate-900">
              Schedule
            </a>
            <a href="#about" className="hover:text-slate-900">
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-semibold rounded border border-slate-300 hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm font-semibold rounded bg-[#0b5b36] text-white hover:bg-[#084f2f]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        {error && (
          <div className="mt-4 mb-4 border border-red-200 bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-semibold">
            {error}
          </div>
        )}

        <section className="mt-6 rounded-xl overflow-hidden border border-[#0f5b38] bg-[#0a5a37]">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-0">
            <div className="p-8 md:p-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.25),transparent_50%)]">
              <span className="inline-flex items-center gap-2 text-[11px] px-2 py-1 rounded bg-[#ef4444] text-white font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Live Now
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight text-white">
                Track Every Ball
                <br />
                <span className="text-[#8bffad]">In Real-Time</span>
              </h1>
              <p className="mt-4 text-sm md:text-base text-[#d5f2df] max-w-xl">
                The world's most advanced cricket management platform. Get
                ball-by-ball updates, deep analytics, and live player stats across
                all major leagues.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/matches"
                  className="px-5 py-3 bg-[#8bffad] text-[#064329] text-sm font-bold rounded hover:bg-[#7cf89f]"
                >
                  Explore All Matches
                </Link>
                <a
                  href="#fixtures"
                  className="px-5 py-3 border border-[#84d7a6] text-white text-sm font-bold rounded hover:bg-white/10"
                >
                  View Tournament Schedule
                </a>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-[#0a4e31]/75 border-l border-[#2f7a56]">
              {isLoading ? (
                <p className="text-sm font-semibold text-[#d5f2df]">Loading live match...</p>
              ) : !featuredLiveMatch ? (
                <p className="text-sm font-semibold text-[#d5f2df]">No live matches currently.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between text-[11px] uppercase text-[#bedfca] tracking-wide">
                    <span>{featuredLiveMatch?.seriesId?.name || "Live Match"}</span>
                    <span>Overs: {featuredLiveView.overs}</span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[#143f2d] text-[#c9f7da] flex items-center justify-center font-bold text-xs">
                          {featuredLiveMatch?.team1?.shortName || "T1"}
                        </div>
                        <span className="text-white font-semibold">
                          {featuredLiveMatch?.team1?.name || "Team 1"}
                        </span>
                      </div>
                      <span className="text-4xl font-black text-white">
                        {featuredLiveView.team1Score}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[#143f2d] text-[#c9f7da] flex items-center justify-center font-bold text-xs">
                          {featuredLiveMatch?.team2?.shortName || "T2"}
                        </div>
                        <span className="text-[#d5f2df] font-semibold">
                          {featuredLiveMatch?.team2?.name || "Team 2"}
                        </span>
                      </div>
                      <span className="text-4xl font-black text-[#d5f2df]">
                        {featuredLiveView.team2Score}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#2f7a56] text-xs text-[#d5f2df]">
                    <div className="flex justify-between">
                      <span>Current Batters</span>
                      <span className="text-right">
                        {featuredLiveView.currentBatters.length
                          ? featuredLiveView.currentBatters.join(" | ")
                          : "Awaiting lineup"}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>Latest Update</span>
                      <span className="text-right max-w-[70%] truncate">
                        {featuredLiveView.lastHighlight}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="fixtures" className="mt-8 bg-white border border-slate-200 rounded-xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-3xl font-bold text-[#0f172a]">Upcoming Fixtures</h2>
              <p className="text-sm text-slate-500 mt-1">
                Never miss a match with our comprehensive global calendar.
              </p>
            </div>
            <Link to="/matches" className="text-sm font-semibold text-[#0b5b36] hover:underline">
              View Full Calendar
            </Link>
          </div>

          {isLoading ? (
            <div className="text-sm font-semibold text-slate-500">Loading upcoming fixtures...</div>
          ) : !topUpcoming.length ? (
            <div className="text-sm font-semibold text-slate-500">No upcoming fixtures.</div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {topUpcoming.map((match) => (
                <div key={match._id} className="border border-slate-200 rounded-lg p-4 bg-[#fafcff]">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    {match?.seriesId?.name || "Fixture"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {formatCompactDateTime(match?.startTime)}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded bg-slate-100 flex items-center justify-center text-xs font-bold">
                        {match?.team1?.shortName || "T1"}
                      </div>
                      <p className="mt-2 text-xs font-semibold">{match?.team1?.name || "Team 1"}</p>
                    </div>
                    <span className="text-slate-300 font-black text-xs">VS</span>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded bg-slate-100 flex items-center justify-center text-xs font-bold">
                        {match?.team2?.shortName || "T2"}
                      </div>
                      <p className="mt-2 text-xs font-semibold">{match?.team2?.name || "Team 2"}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-slate-500">{match?.venue || "Venue TBA"}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="about" className="mt-8 rounded-xl overflow-hidden border border-[#0f5b38] bg-[#0a5a37] text-white">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-0">
            <div className="p-8 md:p-10">
              <h2 className="text-4xl font-black leading-tight">
                Join the Global <span className="text-[#8bffad]">Cricket Community</span>
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-[#d5f2df]">
                <li>Personalized fan dashboard with your favorite teams.</li>
                <li>Exclusive player stats and head-to-head history.</li>
                <li>Live chat with fans during every major fixture.</li>
              </ul>
              <div className="mt-7 flex gap-3">
                <Link
                  to="/register"
                  className="px-5 py-3 bg-[#8bffad] text-[#064329] text-sm font-bold rounded hover:bg-[#7cf89f]"
                >
                  Get Started for Free
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-3 border border-[#84d7a6] text-white text-sm font-bold rounded hover:bg-white/10"
                >
                  Log in to Account
                </Link>
              </div>
            </div>

            <div className="p-8 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80"
                alt="analytics dashboard"
                className="w-full max-w-md rounded-lg border border-[#2f7a56] shadow-xl"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-black text-[#0b5b36]">{feed.liveMatches.length}+ </p>
            <p className="text-[11px] tracking-wider uppercase text-slate-500">Live Matches</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0b5b36]">24/7</p>
            <p className="text-[11px] tracking-wider uppercase text-slate-500">Live Data Updates</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0b5b36]">{feed.upcomingMatches.length}+ </p>
            <p className="text-[11px] tracking-wider uppercase text-slate-500">Upcoming Fixtures</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0b5b36]">{updateItems.length}+ </p>
            <p className="text-[11px] tracking-wider uppercase text-slate-500">Live Updates</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="bg-[#0f172a] text-slate-300 rounded-xl px-6 py-6 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-xl font-bold text-white">CricManager</p>
              <p className="text-sm mt-1">
                Professional cricket analytics and live scoring for fans around the world.
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-xs uppercase tracking-wide flex gap-5">
              <span>Terms</span>
              <span>Privacy</span>
              <span>Cookies</span>
              <span>Support</span>
            </div>
          </div>
        </section>
        </div>
    </main>
  );
};
