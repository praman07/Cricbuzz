const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const toPublicPlayer = (player, onStrike) => {
  if (!player) return null;

  return {
    _id: player._id,
    name: player.name,
    role: player.role,
    battingStyle: player.battingStyle,
    bowlingStyle: player.bowlingStyle,
    image: player.image,
    ...(typeof onStrike === "boolean" ? { onStrike } : {}),
  };
};

const toPublicTeam = (team) => {
  if (!team) return null;
  return {
    _id: team._id,
    name: team.name,
    shortName: team.shortName,
    logo: team.logo,
  };
};

const getBattingTeam = (match, score) => {
  if (score?.battingTeam?.name) return score.battingTeam;

  const team1Id = normalizeId(match?.team1?._id);
  const team2Id = normalizeId(match?.team2?._id);
  const battingTeamId = normalizeId(score?.battingTeam);

  if (battingTeamId && battingTeamId === team1Id) return match.team1;
  if (battingTeamId && battingTeamId === team2Id) return match.team2;

  const tossWinnerId = normalizeId(match?.tossWinner?._id);
  const tossDecision = String(match?.tossDecision || "").toUpperCase();

  if (tossWinnerId && tossDecision === "BAT") {
    return tossWinnerId === team1Id ? match.team1 : match.team2;
  }

  if (tossWinnerId && tossDecision === "BOWL") {
    return tossWinnerId === team1Id ? match.team2 : match.team1;
  }

  return match?.team1 || null;
};

const resolvePlayerFromXI = (playerRef, xi = []) => {
  if (!playerRef) return null;
  if (playerRef?.name) return playerRef;

  const id = normalizeId(playerRef);
  if (!id) return null;

  const playerEntry = xi.find((entry) => normalizeId(entry?.player?._id || entry?.player) === id);
  return playerEntry?.player || null;
};

export const buildMatchPlayersPayload = ({ match, score }) => {
  if (!match) return null;

  const battingTeam = getBattingTeam(match, score);
  const team1Id = normalizeId(match?.team1?._id);
  const team2Id = normalizeId(match?.team2?._id);
  const battingTeamId = normalizeId(battingTeam?._id);

  const battingXI =
    battingTeamId === team1Id
      ? match?.playingXI?.team1 || []
      : battingTeamId === team2Id
        ? match?.playingXI?.team2 || []
        : [];

  const bowlingXI =
    battingTeamId === team1Id
      ? match?.playingXI?.team2 || []
      : battingTeamId === team2Id
        ? match?.playingXI?.team1 || []
        : [];

  const striker =
    resolvePlayerFromXI(score?.striker, battingXI) || battingXI[0]?.player || null;

  const nonStriker =
    resolvePlayerFromXI(score?.nonStriker, battingXI) || battingXI[1]?.player || null;

  const preferredBowlerFromXI = bowlingXI.find((entry) =>
    ["BOWLER", "ALL_ROUNDER"].includes(String(entry?.player?.role || "").toUpperCase())
  )?.player;

  const currentBowler =
    resolvePlayerFromXI(score?.currentBowler, bowlingXI) ||
    preferredBowlerFromXI ||
    bowlingXI[0]?.player ||
    null;

  const battingPlayers = [
    striker ? toPublicPlayer(striker, true) : null,
    nonStriker && normalizeId(nonStriker._id) !== normalizeId(striker?._id)
      ? toPublicPlayer(nonStriker, false)
      : null,
  ].filter(Boolean);

  return {
    matchId: match._id,
    battingTeam: toPublicTeam(battingTeam),
    battingPlayers,
    bowlingPlayer: toPublicPlayer(currentBowler),
    score: score
      ? {
          innings: score.innings,
          score: score.score,
          wickets: score.wickets,
          overs: score.overs,
          runRate: score.runRate,
          target: score.target,
        }
      : null,
  };
};
