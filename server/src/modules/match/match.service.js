import * as matchRepository from "../../repository/match.repository.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";

/**
 * Match Service
 * -----------------------------------------------------------------------
 * All business logic lives here. Throws AppError subclasses on
 * failure — never touches req/res directly.
 * -----------------------------------------------------------------------
 */

/**
 * Get all active matches with optional filters.
 * @param {object} query - { status?, seriesId? }
 * @returns {Promise<object[]>}
 */
export const getMatches = async (query = {}) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.seriesId) filter.seriesId = query.seriesId;

  return matchRepository.findAll(filter);
};

/**
 * Get a single match by ID.
 * @param {string} id - Match ObjectId
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const getMatchById = async (id) => {
  const match = await matchRepository.findById(id);

  if (!match) throw new NotFoundError("Match not found");

  return match;
};

/**
 * Create a new match.
 * @param {object} payload - whitelisted DTO fields
 * @param {string} userId - audit
 * @returns {Promise<object>}
 */
export const createMatch = async (payload, userId) => {
  return matchRepository.create({ ...payload, createdBy: userId, updatedBy: userId });
};

/**
 * Update a match (partial update).
 * @param {string} id - Match ObjectId
 * @param {object} payload - partial match fields
 * @param {string} userId - audit
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const updateMatch = async (id, payload, userId) => {
  const match = await matchRepository.findById(id);

  if (!match) throw new NotFoundError("Match not found");

  return matchRepository.updateById(id, { ...payload, updatedBy: userId });
};

/**
 * Soft-delete a match.
 * @param {string} id - Match ObjectId
 * @param {string} userId - audit
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const deleteMatch = async (id, userId) => {
  const match = await matchRepository.softDeleteById(id, userId);

  if (!match) throw new NotFoundError("Match not found");

  return match;
};
