import * as matchRepository from "./match.repository.js";
import { ensureId } from "../shared/query.js";
import { MATCH_STATUS } from "../../../shared/constants/matchStatus.js";
import NotFoundError from "../../../shared/errors/NotFound.error.js";
import BadRequestError from "../../../shared/errors/BadRequest.error.js";

/**
 * Service Layer — Match (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Public match endpoints ke liye business logic.
 * Sirf reads — koi writes nahi.
 * ─────────────────────────────────────────────────────────────────────
 */

/** Valid public-facing status filter values */
const VALID_STATUS_FILTERS = [
  MATCH_STATUS.LIVE,
  MATCH_STATUS.UPCOMING,
  MATCH_STATUS.COMPLETED,
];

/**
 * Saare matches fetch karo — optional status filter ke saath.
 * @param {string} [status] - Query param ?status=live|upcoming|completed
 * @returns {Promise<object[]>}
 * @throws {BadRequestError} invalid status value pe
 */
export const getMatches = async (status) => {
  if (status && !VALID_STATUS_FILTERS.includes(status.toUpperCase())) {
    throw new BadRequestError(
      `Invalid status. Must be one of: ${VALID_STATUS_FILTERS.join(", ")}`
    );
  }

  return matchRepository.findAll(status?.toUpperCase());
};

/**
 * Single match by ID — scores ke saath.
 * @param {string} matchId
 * @returns {Promise<{ match, scores }>}
 * @throws {NotFoundError}
 */
export const getMatch = async (matchId) => {
  ensureId(matchId, "Match");

  const [match, scores] = await Promise.all([
    matchRepository.findById(matchId),
    matchRepository.findScoresByMatchId(matchId),
  ]);

  if (!match) throw new NotFoundError("Match not found");

  return { match, scores };
};

/**
 * Live match center — matchInfo + liveScore + playingXI + result.
 * @param {string} matchId
 * @returns {Promise<{ matchInfo, liveScore, playingXI, result }>}
 * @throws {NotFoundError}
 */
export const getMatchCenter = async (matchId) => {
  ensureId(matchId, "Match");

  const [match, scores] = await Promise.all([
    matchRepository.findCenter(matchId),
    matchRepository.findScoresByMatchId(matchId),
  ]);

  if (!match) throw new NotFoundError("Match not found");

  // Live score — innings 1 ya 2 jo chal raha hai
  const liveScore = scores.find((s) =>
    [MATCH_STATUS.LIVE, MATCH_STATUS.INNINGS_BREAK].includes(match.status)
      ? s
      : null
  ) || null;

  return {
    matchInfo: {
      _id: match._id,
      seriesId: match.seriesId,
      matchNumber: match.matchNumber,
      venue: match.venue,
      startTime: match.startTime,
      status: match.status,
      team1: match.team1,
      team2: match.team2,
      tossWinner: match.tossWinner,
      tossDecision: match.tossDecision,
    },
    liveScore: scores,
    playingXI: match.playingXI,
    result: match.status === MATCH_STATUS.COMPLETED
      ? { winner: match.winner, result: match.result }
      : null,
  };
};

/**
 * Scorecard — innings-split scores.
 * @param {string} matchId
 * @returns {Promise<{ innings1, innings2 }>}
 * @throws {NotFoundError}
 */
export const getScorecard = async (matchId) => {
  ensureId(matchId, "Match");

  const match = await matchRepository.findById(matchId);

  if (!match) throw new NotFoundError("Match not found");

  const scores = await matchRepository.findScoresByMatchId(matchId);

  return {
    innings1: scores.find((s) => s.innings === 1) || null,
    innings2: scores.find((s) => s.innings === 2) || null,
  };
};