import * as scoreRepository from "./score.repository.js";
import * as matchRepository from "../../repository/match.repository.js";
import { emitToMatch } from "../../sockets/socketGateway.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import ConflictError from "../../shared/errors/conflict.error.js";
import { MATCH_STATUS } from "../../shared/constants/matchStatus.js";
import { buildMatchPlayersPayload } from "../../shared/utils/matchPlayersRealtime.js";

/**
 * Service Layer — Score
 * -----------------------------------------------------------------------
 * Live scoring ke liye business logic.
 * Match LIVE hona chahiye — warna score create/update nahi hoga.
 * Socket.IO se score.updated event emit hota hai har write pe.
 * -----------------------------------------------------------------------
 */

/**
 * Match LIVE hai ya nahi check karo.
 * @param {string} matchId
 * @returns {Promise<object>} match document
 * @throws {NotFoundError} | {BadRequestError}
 */
const ensureLiveMatch = async (matchId) => {
  const match = await matchRepository.findById(matchId);

  if (!match) throw new NotFoundError("Match not found");

  const liveStatuses = [MATCH_STATUS.LIVE, MATCH_STATUS.INNINGS_BREAK];

  if (!liveStatuses.includes(match.status)) {
    throw new BadRequestError(
      `Score can only be updated when match is LIVE or INNINGS_BREAK — current: ${match.status}`
    );
  }

  return match;
};

/**
 * Create innings score.
 * @param {object} payload - { matchId, innings, battingTeam, score?, wickets?, overs?, runRate?, target? }
 * @param {string} userId - audit
 * @returns {Promise<object>}
 * @throws {ConflictError} agar us innings ka score already exist karta hai
 */
export const createScore = async (payload, userId) => {
  const match = await ensureLiveMatch(payload.matchId);

  // Duplicate innings check
  const existing = await scoreRepository.findByMatchAndInnings(
    payload.matchId,
    payload.innings
  );

  if (existing) {
    throw new ConflictError(
      `Score for innings ${payload.innings} already exists for this match`
    );
  }

  const score = await scoreRepository.create({ ...payload, createdBy: userId, updatedBy: userId });

  // ─── Socket.IO event ──────────────────────────────────────────────
  emitToMatch(payload.matchId, "score.updated", score);
  emitToMatch(
    payload.matchId,
    "players.updated",
    buildMatchPlayersPayload({ match, score })
  );

  return score;
};

/**
 * Update innings score.
 * @param {string} id - Score ObjectId
 * @param {object} payload - partial score fields
 * @param {string} userId - audit
 * @returns {Promise<object>}
 */
export const updateScore = async (id, payload, userId) => {
  const score = await scoreRepository.findById(id);

  if (!score) throw new NotFoundError("Score not found");

  const match = await ensureLiveMatch(score.matchId.toString());

  const updated = await scoreRepository.updateById(id, { ...payload, updatedBy: userId });

  // ─── Socket.IO event ──────────────────────────────────────────────
  emitToMatch(score.matchId.toString(), "score.updated", updated);
  emitToMatch(
    score.matchId.toString(),
    "players.updated",
    buildMatchPlayersPayload({ match, score: updated })
  );

  return updated;
};

/**
 * Get all scores for a match.
 * @param {string} matchId
 * @returns {Promise<object[]>}
 */
export const getScoresByMatch = async (matchId) => {
  const scores = await scoreRepository.findByMatchId(matchId);
  return scores;
};