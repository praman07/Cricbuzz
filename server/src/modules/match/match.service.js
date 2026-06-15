import * as matchRepository from "../../repository/match.repository.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import { MATCH_STATUS } from "../../shared/constants/matchStatus.js";

const VALID_TRANSITIONS = {
  [MATCH_STATUS.UPCOMING]: [MATCH_STATUS.TOSS_COMPLETED],
  [MATCH_STATUS.TOSS_COMPLETED]: [MATCH_STATUS.PLAYING_XI_SELECTED],
  [MATCH_STATUS.PLAYING_XI_SELECTED]: [MATCH_STATUS.LIVE],
  [MATCH_STATUS.LIVE]: [MATCH_STATUS.INNINGS_BREAK, MATCH_STATUS.COMPLETED],
  [MATCH_STATUS.INNINGS_BREAK]: [MATCH_STATUS.LIVE, MATCH_STATUS.COMPLETED],
  [MATCH_STATUS.COMPLETED]: [],
};

export const getMatches = async (query = {}) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.seriesId) filter.seriesId = query.seriesId;
  return matchRepository.findAll(filter);
};

export const getMatchById = async (id) => {
  const match = await matchRepository.findById(id);
  if (!match) throw new NotFoundError("Match not found");
  return match;
};

export const createMatch = async (payload, userId) => {
  return matchRepository.create({ ...payload, createdBy: userId, updatedBy: userId });
};

export const updateMatch = async (id, payload, userId) => {
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

  return matchRepository.updateById(id, { ...payload, updatedBy: userId });
};

export const deleteMatch = async (id, userId) => {
  const match = await matchRepository.softDeleteById(id, userId);
  if (!match) throw new NotFoundError("Match not found");
  return match;
};