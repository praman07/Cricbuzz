import * as teamRepository from "../../repository/team.repository.js";
import PlayersRepo from "../../repository/players.repository.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import ConflictError from "../../shared/errors/conflict.error.js";

// Class-based PlayersRepo ka instance
const playerRepo = new PlayersRepo();

/**
 * Team Service (Admin + Public)
 * ─────────────────────────────────────────────────────────────────────
 * PUBLIC  reads : getTeams, getTeamById
 * ADMIN   writes: createTeam, updateTeam, deleteTeam,
 *                 getSquad, addPlayerToSquad, removePlayerFromSquad
 *
 * All business logic lives here. Throws AppError subclasses on
 * failure — never touches req/res directly.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─── Public ──────────────────────────────────────────────────────────

/**
 * Get all active teams.
 * @returns {Promise<object[]>}
 */
export const getTeams = () => teamRepository.findAll();

/**
 * Get a single team by ID.
 * @param {string} id - Team ObjectId
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const getTeamById = async (id) => {
  const team = await teamRepository.findById(id);

  if (!team) throw new NotFoundError("Team not found");

  return team;
};

// ─── Admin ────────────────────────────────────────────────────────────

/**
 * Create a new team.
 * Enforces uniqueness on both name and shortName.
 * @param {object} payload - { name, shortName, logo, primaryColor? }
 * @param {string} userId - audit
 * @returns {Promise<object>}
 * @throws {ConflictError}
 */
export const createTeam = async (payload, userId) => {
  const existing = await teamRepository.findByNameOrShortName(
    payload.name,
    payload.shortName
  );

  if (existing) {
    throw new ConflictError("A team with this name or short name already exists");
  }

  return teamRepository.create({ ...payload, createdBy: userId, updatedBy: userId });
};

/**
 * Update a team's details (partial update).
 * Re-checks uniqueness when name/shortName are being changed.
 * @param {string} id - Team ObjectId
 * @param {object} payload - Partial team fields
 * @param {string} userId - audit
 * @returns {Promise<object>}
 * @throws {NotFoundError} | {ConflictError}
 */
export const updateTeam = async (id, payload, userId) => {
  const team = await teamRepository.findById(id);

  if (!team) throw new NotFoundError("Team not found");

  if (payload.name || payload.shortName) {
    const existing = await teamRepository.findByNameOrShortName(
      payload.name ?? team.name,
      payload.shortName ?? team.shortName,
      id
    );

    if (existing) {
      throw new ConflictError("A team with this name or short name already exists");
    }
  }

  return teamRepository.updateById(id, { ...payload, updatedBy: userId });
};

/**
 * Soft-delete a team.
 * @param {string} id - Team ObjectId
 * @param {string} userId - audit
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const deleteTeam = async (id, userId) => {
  const team = await teamRepository.softDeleteById(id, userId);

  if (!team) throw new NotFoundError("Team not found");

  return team;
};

/**
 * Get a team's squad (populated player list).
 * @param {string} teamId - Team ObjectId
 * @returns {Promise<object[]>}
 * @throws {NotFoundError}
 */
export const getSquad = async (teamId) => {
  const team = await teamRepository.findById(teamId);

  if (!team) throw new NotFoundError("Team not found");

  return team.squadPlayers;
};

/**
 * Add a player to a team's squad.
 * Verifies both team and player exist, guards duplicate additions.
 * @param {string} teamId - Team ObjectId
 * @param {string} playerId - Player ObjectId
 * @returns {Promise<object>}
 * @throws {NotFoundError} | {ConflictError}
 */
export const addPlayerToSquad = async (teamId, playerId) => {
  const team = await teamRepository.findById(teamId);

  if (!team) throw new NotFoundError("Team not found");

  const playerExists = await playerRepo.exists(playerId);

  if (!playerExists) throw new NotFoundError("Player not found");

  const alreadyInSquad = team.squadPlayers.some(
    (p) => p._id.toString() === playerId
  );

  if (alreadyInSquad) throw new ConflictError("Player is already in this team's squad");

  return teamRepository.addPlayer(teamId, playerId);
};

/**
 * Remove a player from a team's squad.
 * @param {string} teamId - Team ObjectId
 * @param {string} playerId - Player ObjectId
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const removePlayerFromSquad = async (teamId, playerId) => {
  const teamExists = await teamRepository.exists(teamId);

  if (!teamExists) throw new NotFoundError("Team not found");

  return teamRepository.removePlayer(teamId, playerId);
};