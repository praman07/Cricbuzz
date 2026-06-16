import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../../../config/axiosInstance";

const SOCKET_URL = axiosInstance.defaults.baseURL || "http://localhost:3000";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const getCurrentScore = (scores = []) =>
  scores.reduce((latest, score) => {
    if (!latest) return score;
    return (score?.innings || 0) > (latest?.innings || 0) ? score : latest;
  }, null);

const upsertScore = (scores, updatedScore) => {
  const index = scores.findIndex(
    (score) => normalizeId(score._id) === normalizeId(updatedScore._id),
  );
  if (index === -1) {
    return [...scores, updatedScore].sort(
      (a, b) => (a?.innings || 0) - (b?.innings || 0),
    );
  }

  const next = [...scores];
  next[index] = updatedScore;
  return next.sort((a, b) => (a?.innings || 0) - (b?.innings || 0));
};

const getFallbackPlayers = (matchInfo, playingXI, currentScore) => {
  if (!matchInfo || !playingXI) {
    return { battingPlayers: [], bowlingPlayer: null };
  }

  const team1Id = normalizeId(matchInfo.team1?._id);
  const team2Id = normalizeId(matchInfo.team2?._id);
  const battingTeamId = normalizeId(
    currentScore?.battingTeam?._id || currentScore?.battingTeam,
  );

  const battingXI =
    battingTeamId === team1Id
      ? playingXI?.team1 || []
      : battingTeamId === team2Id
        ? playingXI?.team2 || []
        : [];

  const bowlingXI =
    battingTeamId === team1Id
      ? playingXI?.team2 || []
      : battingTeamId === team2Id
        ? playingXI?.team1 || []
        : [];

  return {
    battingPlayers: (battingXI || []).slice(0, 2).map((entry, index) => ({
      _id: entry?.player?._id || `fallback-${index}`,
      name: entry?.player?.name || "Unknown Player",
      role: entry?.player?.role,
      onStrike: index === 0,
    })),
    bowlingPlayer:
      bowlingXI.find((entry) =>
        ["BOWLER", "ALL_ROUNDER"].includes(
          String(entry?.player?.role || "").toUpperCase(),
        ),
      )?.player ||
      bowlingXI[0]?.player ||
      null,
  };
};

const enrichLiveMatches = async (matches = []) =>
  Promise.all(
    matches.map(async (match) => {
      const matchId = normalizeId(match._id);
      if (!matchId) return match;

      try {
        const detailsResponse = await axiosInstance.get(`/api/matches/${matchId}`);
        const details = detailsResponse.data?.data || {};
        return {
          ...match,
          latestScore: getCurrentScore(details.scores || []),
        };
      } catch {
        return match;
      }
    }),
  );

const formatStartTime = (value) => {
  if (!value) return "TBA";
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const UserMatchDetails = () => {
  const { id } = useParams();
  const socketRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchInfo, setMatchInfo] = useState(null);
  const [playingXI, setPlayingXI] = useState(null);
  const [scores, setScores] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [livePlayers, setLivePlayers] = useState({
    battingPlayers: [],
    bowlingPlayer: null,
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);

  const loadMatchData = useCallback(
    async (showLoader = true) => {
      if (!id) return;
      if (showLoader) setIsLoading(true);
      setError("");

      try {
        const [matchResponse, centerResponse, commentaryResponse] = await Promise.all([
          axiosInstance.get(`/api/matches/${id}`),
          axiosInstance.get(`/api/matches/${id}/center`),
          axiosInstance.get(`/api/matches/${id}/commentary?limit=20&page=1`),
        ]);

        const matchData = matchResponse.data?.data || {};
        const centerData = centerResponse.data?.data || {};
        const commentaryData = commentaryResponse.data?.data || [];
        const nextScores = Array.isArray(matchData.scores) ? matchData.scores : [];

        setMatchInfo(centerData.matchInfo || matchData.match || null);
        setPlayingXI(centerData.playingXI || null);
        setScores(nextScores);
        setCommentary(Array.isArray(commentaryData) ? commentaryData : []);
        setLivePlayers(
          getFallbackPlayers(
            centerData.matchInfo || matchData.match || null,
            centerData.playingXI || null,
            getCurrentScore(nextScores),
          ),
        );
      } catch (loadError) {
        setError(
          loadError?.response?.data?.message || "Unable to load match details",
        );
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [id],
  );

  const loadAuxiliaryData = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/home");
      const data = response.data?.data || {};
      const rawLive = Array.isArray(data.liveMatches) ? data.liveMatches : [];
      const enriched = await enrichLiveMatches(rawLive);

      setRecentMatches(
        Array.isArray(data.recentMatches) ? data.recentMatches.slice(0, 3) : [],
      );
      setLiveMatches(enriched);
    } catch {
      // non-critical UI feed
    }
  }, []);

  useEffect(() => {
    loadMatchData(true);
    loadAuxiliaryData();
  }, [loadMatchData, loadAuxiliaryData]);

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
    if (!socket || !id) return undefined;

    const refreshNonScoreWidgets = () => {
      loadAuxiliaryData();
    };

    const handleScoreUpdate = (updatedScore) => {
      if (normalizeId(updatedScore?.matchId) !== id) return;
      setScores((previous) => upsertScore(previous, updatedScore));
    };

    const handleCommentaryCreated = (item) => {
      if (normalizeId(item?.matchId) !== id) return;
      setCommentary((previous) => [item, ...previous].slice(0, 20));
    };

    const handleMatchUpdate = (updatedMatch) => {
      if (normalizeId(updatedMatch?._id) !== id) return;

      setMatchInfo((previous) => ({ ...(previous || {}), ...updatedMatch }));
      if (updatedMatch?.playingXI) setPlayingXI(updatedMatch.playingXI);
      refreshNonScoreWidgets();
    };

    const handlePlayersUpdated = (payload) => {
      if (normalizeId(payload?.matchId) !== id) return;
      setLivePlayers({
        battingPlayers: Array.isArray(payload?.battingPlayers)
          ? payload.battingPlayers
          : [],
        bowlingPlayer: payload?.bowlingPlayer || null,
      });
    };

    socket.emit("join-match", id);
    socket.on("score.updated", handleScoreUpdate);
    socket.on("commentary.created", handleCommentaryCreated);
    socket.on("players.updated", handlePlayersUpdated);
    socket.on("match.started", handleMatchUpdate);
    socket.on("match.innings_break", handleMatchUpdate);
    socket.on("match.completed", handleMatchUpdate);
    socket.on("toss.updated", handleMatchUpdate);
    socket.on("playingXI.updated", handleMatchUpdate);

    return () => {
      socket.emit("leave-match", id);
      socket.off("score.updated", handleScoreUpdate);
      socket.off("commentary.created", handleCommentaryCreated);
      socket.off("players.updated", handlePlayersUpdated);
      socket.off("match.started", handleMatchUpdate);
      socket.off("match.innings_break", handleMatchUpdate);
      socket.off("match.completed", handleMatchUpdate);
      socket.off("toss.updated", handleMatchUpdate);
      socket.off("playingXI.updated", handleMatchUpdate);
    };
  }, [id, loadAuxiliaryData]);

  const currentScore = useMemo(() => getCurrentScore(scores), [scores]);
  const playerFeed = useMemo(() => {
    if (livePlayers.battingPlayers.length || livePlayers.bowlingPlayer) {
      return livePlayers;
    }
    return getFallbackPlayers(matchInfo, playingXI, currentScore);
  }, [livePlayers, matchInfo, playingXI, currentScore]);

  const team1Id = normalizeId(matchInfo?.team1?._id);
  const team2Id = normalizeId(matchInfo?.team2?._id);
  const battingTeamId = normalizeId(
    currentScore?.battingTeam?._id || currentScore?.battingTeam,
  );

  const fullScore = `${currentScore?.score || 0}/${currentScore?.wickets || 0}`;
  const team1Score = battingTeamId === team1Id ? fullScore : "Yet to bat";
  const team2Score = battingTeamId === team2Id ? fullScore : "Yet to bat";

  const battingXI =
    battingTeamId === team1Id
      ? playingXI?.team1 || []
      : battingTeamId === team2Id
        ? playingXI?.team2 || []
        : [];
  const bowlingXI =
    battingTeamId === team1Id
      ? playingXI?.team2 || []
      : battingTeamId === team2Id
        ? playingXI?.team1 || []
        : [];

  const activeBatterIds = new Set(
    playerFeed.battingPlayers.map((player) => normalizeId(player?._id)),
  );

  const battingRows = battingXI.map((entry) => {
    const playerId = normalizeId(entry?.player?._id || entry?.player);
    return {
      id: playerId,
      name: entry?.player?.name || "Unknown Player",
      status: activeBatterIds.has(playerId) ? "Batting" : "Yet to bat",
    };
  });

  const bowlingRows = bowlingXI.slice(0, 6).map((entry) => {
    const playerId = normalizeId(entry?.player?._id || entry?.player);
    const isCurrentBowler =
      normalizeId(playerFeed.bowlingPlayer?._id) === playerId;

    return {
      id: playerId,
      name: entry?.player?.name || "Unknown Bowler",
      overs: isCurrentBowler ? currentScore?.overs || "0.0" : "-",
      runs: isCurrentBowler ? currentScore?.score || 0 : "-",
      wickets: isCurrentBowler ? currentScore?.wickets || 0 : "-",
      econ:
        isCurrentBowler && currentScore?.runRate
          ? Number(currentScore.runRate).toFixed(2)
          : "-",
    };
  });

  const otherLiveMatches = liveMatches
    .filter((match) => normalizeId(match._id) !== id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#0f172a]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-[26px] tracking-tight text-[#0e4f2f]">
            CricketManager Pro
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/matches" className="text-[#0e4f2f] border-b-2 border-[#0e4f2f] pb-1">
              Live Matches
            </Link>
            <Link to="/" className="hover:text-slate-900">
              Schedule
            </Link>
            <Link to="/" className="hover:text-slate-900">
              About
            </Link>
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

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#dc2626] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
              Live Updates
            </div>
            <h1 className="text-5xl font-black text-[#111827] leading-tight">
              Live Match Directory
            </h1>
            <p className="text-slate-500 mt-2">
              Real-time statistics and commentary from stadiums around the world.
            </p>
          </div>
          <div className="w-full md:w-[280px]">
            <input
              placeholder="Search team or league..."
              className="w-full px-4 py-2.5 rounded-md border border-slate-300 text-sm bg-white"
            />
          </div>
        </div>

        <div className="mt-5 grid lg:grid-cols-[1fr_260px] gap-4">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {matchInfo?.seriesId?.name || "Live Match"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {matchInfo?.venue || "Venue TBA"} • {formatStartTime(matchInfo?.startTime)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {matchInfo?.status || "LIVE"}
              </span>
            </div>

            {isLoading ? (
              <div className="p-6 text-sm font-semibold text-slate-500">
                Loading match center...
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-3 items-center pb-5 border-b border-slate-200">
                  <div className="text-left">
                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center font-black text-xs">
                      {matchInfo?.team1?.shortName || "T1"}
                    </div>
                    <p className="mt-2 text-[34px] font-black leading-none text-[#0b5b36]">
                      {team1Score}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {battingTeamId === team1Id
                        ? `${currentScore?.overs || "0.0"} Overs`
                        : ""}
                    </p>
                  </div>

                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase">
                      VS
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="w-12 h-12 ml-auto rounded bg-slate-100 flex items-center justify-center font-black text-xs">
                      {matchInfo?.team2?.shortName || "T2"}
                    </div>
                    <p className="mt-2 text-[34px] font-black leading-none text-slate-400">
                      {team2Score}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {battingTeamId === team2Id
                        ? `${currentScore?.overs || "0.0"} Overs`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500 mb-2">
                    {matchInfo?.team1?.name || "Team"} - Batting
                  </p>
                  <div className="overflow-x-auto border border-slate-200 rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                        <tr>
                          <th className="text-left px-3 py-2">Batter</th>
                          <th className="text-left px-3 py-2">Status</th>
                          <th className="text-center px-2 py-2">R</th>
                          <th className="text-center px-2 py-2">B</th>
                          <th className="text-center px-2 py-2">4s</th>
                          <th className="text-center px-2 py-2">6s</th>
                          <th className="text-center px-2 py-2">SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {battingRows.length ? (
                          battingRows.map((row) => (
                            <tr key={row.id} className="border-t border-slate-100">
                              <td className="px-3 py-2 font-semibold text-slate-800">
                                {row.name}
                              </td>
                              <td className="px-3 py-2 text-slate-600">
                                {row.status}
                              </td>
                              <td className="text-center px-2 py-2">-</td>
                              <td className="text-center px-2 py-2">-</td>
                              <td className="text-center px-2 py-2">-</td>
                              <td className="text-center px-2 py-2">-</td>
                              <td className="text-center px-2 py-2">-</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="px-3 py-3 text-sm text-slate-500">
                              Batting lineup unavailable.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500 mb-2">
                    {battingTeamId === team1Id
                      ? `${matchInfo?.team2?.name || "Team"} - Bowling`
                      : `${matchInfo?.team1?.name || "Team"} - Bowling`}
                  </p>
                  <div className="overflow-x-auto border border-slate-200 rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                        <tr>
                          <th className="text-left px-3 py-2">Bowler</th>
                          <th className="text-center px-2 py-2">O</th>
                          <th className="text-center px-2 py-2">R</th>
                          <th className="text-center px-2 py-2">W</th>
                          <th className="text-center px-2 py-2">Econ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bowlingRows.length ? (
                          bowlingRows.map((row) => (
                            <tr key={row.id} className="border-t border-slate-100">
                              <td className="px-3 py-2 font-semibold text-slate-800">
                                {row.name}
                              </td>
                              <td className="text-center px-2 py-2">{row.overs}</td>
                              <td className="text-center px-2 py-2">{row.runs}</td>
                              <td className="text-center px-2 py-2">{row.wickets}</td>
                              <td className="text-center px-2 py-2">{row.econ}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-3 py-3 text-sm text-slate-500">
                              Bowling lineup unavailable.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button className="px-6 py-3 rounded bg-[#0b5b36] text-white text-sm font-bold hover:bg-[#084f2f]">
                    View Detailed Scorecard
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg bg-[#19663f] text-white p-4">
              <h3 className="text-2xl font-black">Premium Insights</h3>
              <p className="text-sm mt-2 text-[#d5f2df]">
                Unlock advanced win probability and ball-by-ball heatmaps.
              </p>
              <button className="mt-4 w-full rounded bg-[#a7ebbc] text-[#0b5b36] py-2.5 font-bold">
                Upgrade Now
              </button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-2xl font-black text-[#111827] mb-3">
                Recent Results
              </h3>
              <div className="space-y-3">
                {recentMatches.length ? (
                  recentMatches.map((match) => (
                    <div key={match._id} className="border border-slate-200 rounded p-3">
                      <div className="flex justify-between items-center text-[10px] uppercase text-slate-500 font-bold">
                        <span>{match?.seriesId?.name || "Series"}</span>
                        <span>Completed</span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {match?.team1?.name || "Team 1"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {match?.team2?.name || "Team 2"}
                      </p>
                      <p className="mt-2 text-xs text-[#0b5b36] font-semibold">
                        {match?.result || "Result posted"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No recent results available.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-8">
          <h3 className="text-2xl font-black text-[#111827] mb-4">Other Live Matches</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {otherLiveMatches.length ? (
              otherLiveMatches.map((match) => {
                const score = match?.latestScore;
                const matchScore = score
                  ? `${score?.score || 0}/${score?.wickets || 0} (${score?.overs || "0.0"})`
                  : "Live";

                return (
                  <Link
                    key={match._id}
                    to={`/matches/${match._id}`}
                    className="rounded-lg border border-slate-200 bg-white p-4 hover:border-[#0b5b36] transition"
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase text-slate-500 font-bold">
                      <span>{match?.seriesId?.name || "Live"}</span>
                      <span className="text-red-500">LIVE</span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-800">
                      {match?.team1?.name || "Team 1"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {match?.team2?.name || "Team 2"}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-[#0b5b36]">
                      {matchScore}
                    </p>
                  </Link>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">
                No other live matches at this moment.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="bg-[#0f172a] text-slate-300 rounded-xl px-6 py-6 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-xl font-bold text-white">CricketManager Pro</p>
              <p className="text-sm mt-1">
                Real-time cricket insights for every fan around the world.
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-xs uppercase tracking-wide flex gap-5">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Us</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
