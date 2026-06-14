import * as teamRepository from "./team.repository.js";
import { ensureId } from "../shared/query.js";
import NotFoundError from "../../../shared/errors/NotFound.error.js";

/**
 * Service Layer — Team (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Read-only service. Sirf GET operations.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Saari active teams fetch karo.
 * @returns {Promise<object[]>}
 */
export const getTeams = () => teamRepository.findAll();

/**
 * Single team by ID with squad.
 * @param {string} teamId
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const getTeamById = async (teamId) => {
  ensureId(teamId, "Team");

  const team = await teamRepository.findById(teamId);

  if (!team) throw new NotFoundError("Team not found");

  return team;
};