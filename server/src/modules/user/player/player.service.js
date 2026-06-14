import * as playerRepository from "./player.repository.js";
import { ensureId } from "../shared/query.js";
import NotFoundError from "../../../shared/errors/NotFound.error.js";

/**
 * Service Layer — Player (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Read-only service. Sirf GET operations.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Saare active players fetch karo.
 * @returns {Promise<object[]>}
 */
export const getPlayers = () => playerRepository.findAll();

/**
 * Single player by ID.
 * @param {string} playerId
 * @returns {Promise<object>}
 * @throws {NotFoundError}
 */
export const getPlayerById = async (playerId) => {
  ensureId(playerId, "Player");

  const player = await playerRepository.findById(playerId);

  if (!player) throw new NotFoundError("Player not found");

  return player;
};