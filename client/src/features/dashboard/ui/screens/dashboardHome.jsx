import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { Play, RotateCcw, Activity } from "lucide-react";
import axiosInstance from "../../../../config/axiosInstance";

const MAX_TIMELINE_ITEMS = 10;
const LIVE_STATUSES = new Set(["LIVE", "INNINGS_BREAK"]);

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const toOversDecimal = (overs = "0.0") => {
  const [completeOvers = "0", balls = "0"] = String(overs).split(".");
  return Number(completeOvers) + Number(balls) / 6;
};

const calculateRunRate = (runs, overs) => {
  const oversDecimal = toOversDecimal(overs);
  if (!oversDecimal) return 0;
  return Number((runs / oversDecimal).toFixed(2));
};

const incrementOverBall = (overs = "0.0") => {
  const [completeOvers = "0", balls = "0"] = String(overs).split(".");
  const totalBalls = Number(completeOvers) * 6 + Number(balls) + 1;
  const nextOvers = Math.floor(totalBalls / 6);
  const nextBalls = totalBalls % 6;
  return `${nextOvers}.${nextBalls}`;
};

const upsertScore = (scores, updatedScore) => {
  const existingIndex = scores.findIndex(
    (score) => normalizeId(score._id) === normalizeId(updatedScore._id),
  );

  if (existingIndex === -1) {
    return [...scores, updatedScore].sort(
      (a, b) => (a.innings || 0) - (b.innings || 0),
    );
  }

  const nextScores = [...scores];
  nextScores[existingIndex] = updatedScore;
  return nextScores.sort((a, b) => (a.innings || 0) - (b.innings || 0));
};

const getCurrentInningsScore = (scores) =>
  scores.reduce((latest, score) => {
    if (!latest) return score;
    return (score.innings || 0) > (latest.innings || 0) ? score : latest;
  }, null);

const inferTimelineBall = (previousScore, nextScore) => {
  if (!previousScore || !nextScore) return null;

  const wicketsDiff = (nextScore.wickets || 0) - (previousScore.wickets || 0);
  if (wicketsDiff > 0) return "W";

  const scoreDiff = (nextScore.score || 0) - (previousScore.score || 0);
  if (scoreDiff > 0) return String(scoreDiff);
  if (nextScore.overs !== previousScore.overs) return "0";

  return null;
};

const appendTimeline = (setTimeline, ball) => {
  if (!ball) return;
  setTimeline((previous) => [...previous, ball].slice(-MAX_TIMELINE_ITEMS));
};

const getBattingTeamId = (matchInfo) => {
  if (!matchInfo) return null;

  const team1Id = normalizeId(matchInfo.team1?._id);
  const team2Id = normalizeId(matchInfo.team2?._id);
  const tossWinnerId = normalizeId(matchInfo.tossWinner?._id);
  const tossDecision = String(matchInfo.tossDecision || "").toUpperCase();

  if (tossWinnerId && tossDecision === "BAT") return tossWinnerId;

  if (tossWinnerId && tossDecision === "BOWL") {
    return tossWinnerId === team1Id ? team2Id : team1Id;
  }

  return team1Id || team2Id || null;
};

const getBallColor = (ball) => {
  if (ball === "W") return "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]";
  if (ball === "4" || ball === "6")
    return "bg-[#e7f9eb] text-[#2ebd4f] border-[#bbf7d0]";
  if (ball === "Wd" || ball === "Nb")
    return "bg-[#e0e7ff] text-[#4f46e5] border-[#c7d2fe]";
  return "bg-[#f1f5f9] text-slate-700 border-[#e2e8f0]";
};

const getFallbackPlayers = (matchInfo, playingXI, currentScore) => {
  if (!matchInfo || !playingXI) {
    return { battingPlayers: [], bowlingPlayer: null };
  }

  const team1Id = normalizeId(matchInfo.team1?._id);
  const team2Id = normalizeId(matchInfo.team2?._id);
  const battingTeamId =
    normalizeId(currentScore?.battingTeam?._id || currentScore?.battingTeam) ||
    getBattingTeamId(matchInfo);

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
    battingPlayers: (battingXI || [])
      .slice(0, 2)
      .map((entry, index) => ({
        _id: entry?.player?._id || `fallback-${index}`,
        name: entry?.player?.name || "Unknown Player",
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

const getSelectionOptions = (matchInfo, playingXI, currentScore) => {
  if (!matchInfo || !playingXI) {
    return { battingOptions: [], bowlingOptions: [] };
  }

  const team1Id = normalizeId(matchInfo.team1?._id);
  const team2Id = normalizeId(matchInfo.team2?._id);
  const battingTeamId =
    normalizeId(currentScore?.battingTeam?._id || currentScore?.battingTeam) ||
    getBattingTeamId(matchInfo);

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

  const toOption = (entry, index) => ({
    id: normalizeId(entry?.player?._id || entry?.player || `player-${index}`),
    name: entry?.player?.name || "Unknown Player",
  });

  return {
    battingOptions: battingXI.map(toOption).filter((option) => option.id),
    bowlingOptions: bowlingXI.map(toOption).filter((option) => option.id),
  };
};

const DashboardHome = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [matchCenter, setMatchCenter] = useState(null);
  const [scores, setScores] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [livePlayers, setLivePlayers] = useState({
    battingPlayers: [],
    bowlingPlayer: null,
  });
  const [selectedStrikerId, setSelectedStrikerId] = useState("");
  const [selectedNonStrikerId, setSelectedNonStrikerId] = useState("");
  const [selectedBowlerId, setSelectedBowlerId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const socketRef = useRef(null);
  const actionHistoryRef = useRef([]);
  const activeScoreRef = useRef(null);

  const refreshLiveMatches = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/matches?status=LIVE");
      const nextLiveMatches = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setLiveMatches(nextLiveMatches);
      setSelectedMatchId((currentMatchId) => {
        if (!nextLiveMatches.length) return "";
        if (
          currentMatchId &&
          nextLiveMatches.some(
            (match) => normalizeId(match._id) === currentMatchId,
          )
        ) {
          return currentMatchId;
        }
        return normalizeId(nextLiveMatches[0]._id);
      });
    } catch (refreshError) {
      setError(
        refreshError?.response?.data?.message || "Unable to fetch live matches",
      );
    }
  }, []);

  const loadMatchData = useCallback(async (matchId) => {
    if (!matchId) return;

    setIsLoading(true);
    setError("");

    try {
      const [centerResponse, scoresResponse] = await Promise.all([
        axiosInstance.get(`/api/matches/${matchId}/center`),
        axiosInstance.get(`/api/score/match/${matchId}`),
      ]);

      const centerData = centerResponse.data?.data || null;
      const scoreData = Array.isArray(scoresResponse.data?.data)
        ? scoresResponse.data.data
        : [];

      setMatchCenter(centerData);
      setScores(scoreData);
      setTimeline([]);
      setLivePlayers(
        getFallbackPlayers(
          centerData?.matchInfo || null,
          centerData?.playingXI || null,
          getCurrentInningsScore(scoreData),
        ),
      );

      actionHistoryRef.current = [];
      activeScoreRef.current = getCurrentInningsScore(scoreData);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message || "Unable to load match center",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLiveMatches();
  }, [refreshLiveMatches]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshLiveMatches();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refreshLiveMatches]);

  useEffect(() => {
    if (!selectedMatchId) {
      setIsLoading(false);
      setMatchCenter(null);
      setScores([]);
      setLivePlayers({ battingPlayers: [], bowlingPlayer: null });
      setSelectedStrikerId("");
      setSelectedNonStrikerId("");
      setSelectedBowlerId("");
      return;
    }

    loadMatchData(selectedMatchId);
  }, [selectedMatchId, loadMatchData]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
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
    if (!socket || !selectedMatchId) return undefined;

    const applyMatchUpdate = (updatedMatch) => {
      if (normalizeId(updatedMatch?._id) !== selectedMatchId) return;

      setMatchCenter((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          matchInfo: {
            ...previous.matchInfo,
            ...updatedMatch,
          },
          playingXI: updatedMatch?.playingXI || previous.playingXI,
        };
      });

      refreshLiveMatches();
    };

    const handleScoreUpdated = (updatedScore) => {
      if (normalizeId(updatedScore?.matchId) !== selectedMatchId) return;

      setScores((previousScores) => {
        const nextScores = upsertScore(previousScores, updatedScore);
        const previousActiveScore = getCurrentInningsScore(previousScores);
        const nextActiveScore = getCurrentInningsScore(nextScores);
        const inferredBall = inferTimelineBall(
          previousActiveScore,
          nextActiveScore,
        );

        appendTimeline(setTimeline, inferredBall);
        activeScoreRef.current = nextActiveScore;

        return nextScores;
      });
    };

    const handlePlayersUpdated = (payload) => {
      if (normalizeId(payload?.matchId) !== selectedMatchId) return;
      setLivePlayers({
        battingPlayers: Array.isArray(payload?.battingPlayers)
          ? payload.battingPlayers
          : [],
        bowlingPlayer: payload?.bowlingPlayer || null,
      });
    };

    socket.emit("join-match", selectedMatchId);
    socket.on("score.updated", handleScoreUpdated);
    socket.on("match.started", applyMatchUpdate);
    socket.on("match.innings_break", applyMatchUpdate);
    socket.on("match.completed", applyMatchUpdate);
    socket.on("toss.updated", applyMatchUpdate);
    socket.on("playingXI.updated", applyMatchUpdate);
    socket.on("players.updated", handlePlayersUpdated);

    return () => {
      socket.emit("leave-match", selectedMatchId);
      socket.off("score.updated", handleScoreUpdated);
      socket.off("match.started", applyMatchUpdate);
      socket.off("match.innings_break", applyMatchUpdate);
      socket.off("match.completed", applyMatchUpdate);
      socket.off("toss.updated", applyMatchUpdate);
      socket.off("playingXI.updated", applyMatchUpdate);
      socket.off("players.updated", handlePlayersUpdated);
    };
  }, [selectedMatchId, refreshLiveMatches]);

  const currentMatch = useMemo(
    () =>
      liveMatches.find((match) => normalizeId(match._id) === selectedMatchId) ||
      null,
    [liveMatches, selectedMatchId],
  );

  const matchInfo = matchCenter?.matchInfo || currentMatch;
  const currentScore = useMemo(() => getCurrentInningsScore(scores), [scores]);

  useEffect(() => {
    activeScoreRef.current = currentScore;
  }, [currentScore]);

  const displayedRuns = currentScore?.score || 0;
  const displayedWickets = currentScore?.wickets || 0;
  const displayedOvers = currentScore?.overs || "0.0";
  const displayedRunRate =
    currentScore?.runRate || calculateRunRate(displayedRuns, displayedOvers);
  const displayedTarget = currentScore?.target;
  const scoringDisabled = isSubmitting || !selectedMatchId;

  const activeBatsmen = useMemo(() => {
    if (livePlayers.battingPlayers.length) {
      return livePlayers.battingPlayers.map((player, index) => ({
        id: player?._id || `${index}`,
        name: player?.name || "Unknown Player",
        onStrike: Boolean(player?.onStrike),
      }));
    }

    const fallback = getFallbackPlayers(
      matchInfo,
      matchCenter?.playingXI || null,
      currentScore,
    );
    return fallback.battingPlayers.map((player, index) => ({
      id: player?._id || `${index}`,
      name: player?.name || "Unknown Player",
      onStrike: Boolean(player?.onStrike),
    }));
  }, [livePlayers, matchInfo, matchCenter, currentScore]);

  const currentBowler = useMemo(() => {
    if (livePlayers?.bowlingPlayer) return livePlayers.bowlingPlayer;
    return getFallbackPlayers(
      matchInfo,
      matchCenter?.playingXI || null,
      currentScore,
    ).bowlingPlayer;
  }, [livePlayers, matchInfo, matchCenter, currentScore]);

  const { battingOptions, bowlingOptions } = useMemo(
    () => getSelectionOptions(matchInfo, matchCenter?.playingXI || null, currentScore),
    [matchInfo, matchCenter, currentScore],
  );

  useEffect(() => {
    const fallbackStrikerId =
      activeBatsmen.find((player) => player.onStrike)?.id || battingOptions[0]?.id || "";
    const fallbackNonStrikerId =
      activeBatsmen.find((player) => !player.onStrike)?.id ||
      battingOptions.find((player) => player.id !== fallbackStrikerId)?.id ||
      "";
    const fallbackBowlerId =
      normalizeId(currentBowler?._id) || bowlingOptions[0]?.id || "";

    setSelectedStrikerId((current) =>
      battingOptions.some((player) => player.id === current) ? current : fallbackStrikerId,
    );

    setSelectedNonStrikerId((current) => {
      if (battingOptions.some((player) => player.id === current) && current !== fallbackStrikerId) {
        return current;
      }
      return fallbackNonStrikerId;
    });

    setSelectedBowlerId((current) =>
      bowlingOptions.some((player) => player.id === current) ? current : fallbackBowlerId,
    );
  }, [activeBatsmen, battingOptions, bowlingOptions, currentBowler]);

  const getPlayerSelectionPayload = useCallback(() => {
    const payload = {};
    if (selectedStrikerId) payload.striker = selectedStrikerId;
    if (selectedNonStrikerId && selectedNonStrikerId !== selectedStrikerId) {
      payload.nonStriker = selectedNonStrikerId;
    }
    if (selectedBowlerId) payload.currentBowler = selectedBowlerId;
    return payload;
  }, [selectedStrikerId, selectedNonStrikerId, selectedBowlerId]);

  const ensureScoreForUpdate = useCallback(async () => {
    const existingScore = activeScoreRef.current;
    if (existingScore) return existingScore;

    if (!selectedMatchId || !matchInfo) {
      throw new Error("No active live match selected");
    }

    const battingTeam = getBattingTeamId(matchInfo);
    if (!battingTeam)
      throw new Error("Batting team is not available for this match");

    try {
      const createResponse = await axiosInstance.post("/api/score", {
        matchId: selectedMatchId,
        innings: 1,
        battingTeam,
        score: 0,
        wickets: 0,
        overs: "0.0",
        runRate: 0,
        ...getPlayerSelectionPayload(),
      });

      const createdScore = createResponse.data?.data;
      if (!createdScore) throw new Error("Unable to initialize innings score");

      setScores((previous) => upsertScore(previous, createdScore));
      activeScoreRef.current = createdScore;
      return createdScore;
    } catch (createError) {
      if (createError?.response?.status === 409) {
        const scoresResponse = await axiosInstance.get(
          `/api/score/match/${selectedMatchId}`,
        );
        const latestScores = Array.isArray(scoresResponse.data?.data)
          ? scoresResponse.data.data
          : [];
        setScores(latestScores);
        activeScoreRef.current = getCurrentInningsScore(latestScores);

        if (activeScoreRef.current) return activeScoreRef.current;
      }

      throw createError;
    }
  }, [selectedMatchId, matchInfo, getPlayerSelectionPayload]);

  const updateScore = useCallback(
    async (buildPayload) => {
      setError("");
      setIsSubmitting(true);

      try {
        const scoreToUpdate = await ensureScoreForUpdate();
        const nextPayload = buildPayload(scoreToUpdate);

        actionHistoryRef.current.push({
          score: scoreToUpdate.score || 0,
          wickets: scoreToUpdate.wickets || 0,
          overs: scoreToUpdate.overs || "0.0",
          runRate: scoreToUpdate.runRate || 0,
          target: scoreToUpdate.target,
          striker: normalizeId(scoreToUpdate.striker?._id || scoreToUpdate.striker) || undefined,
          nonStriker:
            normalizeId(scoreToUpdate.nonStriker?._id || scoreToUpdate.nonStriker) || undefined,
          currentBowler:
            normalizeId(
              scoreToUpdate.currentBowler?._id || scoreToUpdate.currentBowler,
            ) || undefined,
        });

        if (actionHistoryRef.current.length > 20) {
          actionHistoryRef.current.shift();
        }

        await axiosInstance.patch(
          `/api/score/${scoreToUpdate._id}`,
          { ...nextPayload, ...getPlayerSelectionPayload() },
        );
      } catch (updateError) {
        setError(
          updateError?.response?.data?.message ||
            updateError.message ||
            "Unable to update score",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [ensureScoreForUpdate, getPlayerSelectionPayload],
  );

  const handleRun = (runs) =>
    updateScore((current) => {
      const nextScore = (current.score || 0) + runs;
      const nextOvers = incrementOverBall(current.overs || "0.0");
      return {
        score: nextScore,
        overs: nextOvers,
        runRate: calculateRunRate(nextScore, nextOvers),
      };
    });

  const handleWicket = () =>
    updateScore((current) => {
      const nextWickets = Math.min(10, (current.wickets || 0) + 1);
      const nextOvers = incrementOverBall(current.overs || "0.0");
      return {
        wickets: nextWickets,
        overs: nextOvers,
        runRate: calculateRunRate(current.score || 0, nextOvers),
      };
    });

  const handleExtra = () =>
    updateScore((current) => {
      const nextScore = (current.score || 0) + 1;
      return {
        score: nextScore,
        runRate: calculateRunRate(nextScore, current.overs || "0.0"),
      };
    });

  const handleStrikerChange = (value) => {
    setSelectedStrikerId(value);
    if (value === selectedNonStrikerId) {
      const alternate = battingOptions.find((player) => player.id !== value)?.id || "";
      setSelectedNonStrikerId(alternate);
    }
  };

  const handleNonStrikerChange = (value) => {
    if (value === selectedStrikerId) return;
    setSelectedNonStrikerId(value);
  };

  const handleUndo = async () => {
    if (!activeScoreRef.current || !actionHistoryRef.current.length) return;

    const previousSnapshot = actionHistoryRef.current.pop();
    if (!previousSnapshot) return;

    setError("");
    setIsSubmitting(true);

    try {
      await axiosInstance.patch(
        `/api/score/${activeScoreRef.current._id}`,
        previousSnapshot,
      );
    } catch (undoError) {
      setError(
        undoError?.response?.data?.message ||
          "Unable to undo last scoring action",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusLabel = LIVE_STATUSES.has(
    String(matchInfo?.status || "").toUpperCase(),
  )
    ? "Live Match"
    : matchInfo?.status || "No Live Match";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Scoring Panel</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
            Live Scoring Dashboard
          </h2>
        </div>

        <div className="min-w-[240px]">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Live Match
          </label>
          <select
            value={selectedMatchId}
            onChange={(event) => setSelectedMatchId(event.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-bold text-slate-700 bg-white"
          >
            {!liveMatches.length && <option value="">No live matches</option>}
            {liveMatches.map((match) => (
              <option key={match._id} value={normalizeId(match._id)}>
                {match.team1?.shortName || "TBA"} vs{" "}
                {match.team2?.shortName || "TBA"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-md border border-[#fecaca] bg-[#fff1f2] text-[#be123c] text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] border-t-4 border-t-[#2ebd4f] overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjBjMTEuMDQ2IDAgMjAtOC45NTQgMjAtMjBIMHYyMGMwIDExLjA0NiA4Ljk1NCAyMCAyMCAyMHpNMCAwaDQwdjQwaC00MFYwaDB6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] pointer-events-none"></div>

          <div className="flex items-center space-x-8 z-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-100 shadow-sm">
                <span className="font-bold text-white text-xl">
                  {matchInfo?.team1?.shortName || "TBA"}
                </span>
              </div>
              <span className="font-bold mt-3 text-[15px] text-slate-800">
                {matchInfo?.team1?.name || "Team 1"}
              </span>
            </div>
            <span className="text-2xl font-black text-slate-300">VS</span>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-200 shadow-sm">
                <span className="font-bold text-slate-500 text-xl">
                  {matchInfo?.team2?.shortName || "TBA"}
                </span>
              </div>
              <span className="font-bold mt-3 text-[15px] text-slate-600">
                {matchInfo?.team2?.name || "Team 2"}
              </span>
            </div>
          </div>

          <div className="mt-6 md:mt-0 text-center flex flex-col items-center z-10">
            <div className="flex items-center space-x-2 bg-[#e7f9eb] text-[#2ebd4f] px-3 py-1 rounded border border-[#bbf7d0] mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2ebd4f] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {statusLabel}
              </span>
            </div>
            <h2 className="text-[64px] font-black text-slate-900 tracking-tight leading-none">
              {displayedRuns}
              <span className="text-[40px] text-slate-400 font-bold">
                /{displayedWickets}
              </span>
            </h2>
            <p className="text-slate-500 font-bold mt-2 text-[15px]">
              Overs: {displayedOvers} {isLoading ? "(loading...)" : ""}
            </p>
          </div>

          <div className="mt-6 md:mt-0 text-right z-10">
            <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">
              Current Run Rate
            </p>
            <p className="text-3xl font-black text-[#1E402F] mt-1">
              {displayedRunRate.toFixed(2)}
            </p>
            <div className="mt-4 inline-block bg-slate-100 px-4 py-2 rounded border border-slate-200">
              <p className="text-[13px] font-bold text-slate-600">
                Target:{" "}
                <span className="text-slate-900">
                  {displayedTarget || "--"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[18px] font-bold text-slate-900">
              Update Scoreboard
            </h3>
            <button
              onClick={handleUndo}
              disabled={!actionHistoryRef.current.length || scoringDisabled}
              className="flex items-center text-[13px] font-bold text-[#4f46e5] hover:text-indigo-800 bg-[#e0e7ff] px-4 py-2 rounded transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} className="mr-2" strokeWidth={2.5} />
              Undo Last Entry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Striker
              </label>
              <select
                value={selectedStrikerId}
                onChange={(event) => handleStrikerChange(event.target.value)}
                disabled={scoringDisabled || battingOptions.length === 0}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!battingOptions.length && <option value="">No batsmen available</option>}
                {battingOptions.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Non-Striker
              </label>
              <select
                value={selectedNonStrikerId}
                onChange={(event) => handleNonStrikerChange(event.target.value)}
                disabled={scoringDisabled || battingOptions.length < 2}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {battingOptions.length < 2 && <option value="">Need 2 batsmen</option>}
                {battingOptions
                  .filter((player) => player.id !== selectedStrikerId)
                  .map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Current Bowler
              </label>
              <select
                value={selectedBowlerId}
                onChange={(event) => setSelectedBowlerId(event.target.value)}
                disabled={scoringDisabled || bowlingOptions.length === 0}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!bowlingOptions.length && <option value="">No bowlers available</option>}
                {bowlingOptions.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[0, 1, 2, 3].map((run) => (
              <button
                key={run}
                onClick={() => handleRun(run)}
                disabled={scoringDisabled}
                className="h-16 bg-[#f3f4f6] hover:bg-[#e5e7eb] border border-slate-200 text-slate-800 font-black text-2xl rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {run}
              </button>
            ))}
            <button
              onClick={() => handleRun(4)}
              disabled={scoringDisabled}
              className="h-16 col-span-2 bg-[#e7f9eb] hover:bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] font-black text-2xl rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              4
            </button>
            <button
              onClick={() => handleRun(6)}
              disabled={scoringDisabled}
              className="h-16 col-span-2 bg-[#2ebd4f] hover:bg-[#22c55e] border border-[#16a34a] text-white shadow-sm font-black text-2xl rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              6
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleWicket}
              disabled={scoringDisabled}
              className="h-16 bg-[#ef4444] hover:bg-[#dc2626] border border-[#b91c1c] text-white font-black text-xl rounded-md shadow-sm transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Wicket
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleExtra}
                disabled={scoringDisabled}
                className="h-16 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 text-slate-700 font-bold text-[15px] rounded-md transition-colors shadow-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Wide
              </button>
              <button
                onClick={handleExtra}
                disabled={scoringDisabled}
                className="h-16 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 text-slate-700 font-bold text-[15px] rounded-md transition-colors shadow-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No Ball
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-5 border-b border-[#e5e7eb] pb-3">
              Active Batsmen
            </h3>

            {!activeBatsmen.length ? (
              <p className="text-sm text-slate-500 font-semibold">
                Playing XI not available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {activeBatsmen.map((batsman, index) => (
                  <div
                    key={batsman.id}
                    className="flex items-center justify-between"
                  >
                    <div
                      className={`flex items-center ${index > 0 ? "ml-6" : ""}`}
                    >
                      {batsman.onStrike && (
                        <Play
                          size={14}
                          className="text-[#2ebd4f] mr-2.5"
                          fill="currentColor"
                        />
                      )}
                      <span
                        className={`font-bold text-[15px] ${batsman.onStrike ? "text-slate-800" : "text-slate-600"}`}
                      >
                        {batsman.name}
                      </span>
                    </div>
                    <span className="font-black text-slate-500 text-sm">
                      {batsman.onStrike ? "On Strike" : "Non-Striker"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-[#e5e7eb]">
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                Current Bowler
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-800">
                {currentBowler?.name || "Bowler not assigned"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-5 border-b border-[#e5e7eb] pb-3">
              <span className="flex items-center text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                <Activity size={16} className="mr-2 text-slate-400" />
                Recent Timeline
              </span>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-[13px] font-black text-slate-400 w-8">
                  {(displayedOvers || "0.0").split(".")[0]}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {!timeline.length && (
                    <span className="text-sm text-slate-500 font-semibold">
                      No recent deliveries.
                    </span>
                  )}
                  {timeline.map((ball, index) => (
                    <span
                      key={`${ball}-${index}`}
                      className={`w-8 h-8 rounded border flex items-center justify-center text-[13px] font-bold ${getBallColor(ball)}`}
                    >
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
