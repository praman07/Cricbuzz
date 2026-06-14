import { sendSuccess, sendList } from "../shared/respond.js";
import * as playerService from "./player.service.js";

/**
 * Controller Layer — Player (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated read-only handlers. Cache: 60s TTL.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * GET /api/players
 * Saare active players.
 * Access: Public — Cache: 60s
 */
export const getPlayers = async (req, res) => {
  const players = await playerService.getPlayers();
  return sendList(res, players);
};

/**
 * GET /api/players/:playerId
 * Player details by ID.
 * Access: Public — Cache: 60s
 */
export const getPlayerById = async (req, res) => {
  const player = await playerService.getPlayerById(req.params.playerId);
  return sendSuccess(res, player);
};