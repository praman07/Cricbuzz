import * as matchRepository from "../../repository/match.repository.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import { MATCH_STATUS } from "../../shared/constants/matchStatus.js";
import { emitToMatch } from "../../sockets/socketGateway.js";

const VALID_TRANSITIONS = {
  [MATCH_STATUS.UPCOMING]: [MATCH_STATUS.TOSS_COMPLETED],
  [MATCH_STATUS.TOSS_COMPLETED]: [MATCH_STATUS.PLAYING_XI_SELECTED],
  [MATCH_STATUS.PLAYING_XI_SELECTED]: [MATCH_STATUS.LIVE],
  [MATCH_STATUS.LIVE]: [MATCH_STATUS.INNINGS_BREAK, MATCH_STATUS.COMPLETED],
  [MATCH_STATUS.INNINGS_BREAK]: [MATCH_STATUS.LIVE, MATCH_STATUS.COMPLETED],
  [MATCH_STATUS.COMPLETED]: [],
};

export const getMatches = async (query = {}) => {
  await matchRepository.syncStatusByStartTime();

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.seriesId) filter.seriesId = query.seriesId;
  return matchRepository.findAll(filter);
};

export const getMatchById = async (id) => {
  await matchRepository.syncStatusByStartTime();

  const match = await matchRepository.findById(id);
  if (!match) throw new NotFoundError("Match not found");
  return match;
};

export const createMatch = async (payload, userId) => {
  const derivedStatus =
    new Date(payload.startTime) <= new Date()
      ? MATCH_STATUS.LIVE
      : MATCH_STATUS.UPCOMING;

  return matchRepository.create({
    ...payload,
    status: payload.status || derivedStatus,
    createdBy: userId,
    updatedBy: userId,
  });
};

export const updateMatch = async (id, payload, userId) => {
  await matchRepository.syncStatusByStartTime();

  const match = await matchRepository.findById(id);

  if (!match) throw new NotFoundError("Match not found");

  // State machine check
  if (payload.status && payload.status !== match.status) {
    const allowed = VALID_TRANSITIONS[match.status] || [];

    if (!allowed.includes(payload.status)) {
      throw new BadRequestError(
        `Invalid transition: ${match.status} → ${payload.status}. Allowed: ${allowed.join(", ") || "none"}`
      );
    }

    // Toss validation
    if (payload.status === MATCH_STATUS.TOSS_COMPLETED) {
      if (!payload.tossWinner) throw new BadRequestError("tossWinner required");
      if (!payload.tossDecision) throw new BadRequestError("tossDecision required");
      if (!["BAT", "BOWL"].includes(payload.tossDecision)) {
        throw new BadRequestError("tossDecision must be BAT or BOWL");
      }
    }

    // Complete validation
    if (payload.status === MATCH_STATUS.COMPLETED) {
      if (!payload.winner) throw new BadRequestError("winner required");
      if (!payload.result) throw new BadRequestError("result required");
    }
  }

  // DB update
  const updated = await matchRepository.updateById(id, { ...payload, updatedBy: userId });

  await matchRepository.syncStatusByStartTime();

  // ─── Socket.IO events ─────────────────────────────────────────────
  if (payload.status && payload.status !== match.status) {
    if (payload.status === MATCH_STATUS.TOSS_COMPLETED) {
      emitToMatch(id, "toss.updated", updated);
    }

    if (payload.status === MATCH_STATUS.LIVE) {
      emitToMatch(id, "match.started", updated);
    }

    if (payload.status === MATCH_STATUS.INNINGS_BREAK) {
      emitToMatch(id, "match.innings_break", updated);
    }

    if (payload.status === MATCH_STATUS.COMPLETED) {
      emitToMatch(id, "match.completed", updated);
    }
  }

  return matchRepository.findById(updated._id);
};

export const deleteMatch = async (id, userId) => {
  const match = await matchRepository.softDeleteById(id, userId);
  if (!match) throw new NotFoundError("Match not found");
  return match;
};