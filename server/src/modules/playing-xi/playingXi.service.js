import * as matchRepository from "../../repository/match.repository.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import { MATCH_STATUS } from "../../shared/constants/matchStatus.js";
import { emitToMatch } from "../../sockets/socketGateway.js";
import { buildMatchPlayersPayload } from "../../shared/utils/matchPlayersRealtime.js";

/**
 * Playing XI Service
 * -----------------------------------------------------------------------
 * Validates and persists the 11-player selection for both teams.
 * Transitions match status to PLAYING_XI_SELECTED.
 *
 * Validations:
 *   - Match must be in TOSS_COMPLETED state
 *   - Exactly 11 players per team
 *   - No duplicate players
 *   - Exactly 1 captain per team
 *   - Exactly 1 wicket keeper per team
 *   - All players must be from registered squad
 * -----------------------------------------------------------------------
 */

/**
 * Validate a single team's XI
 * @param {Array} xi - Array of { player, isCaptain, isWicketKeeper }
 * @param {string} teamLabel - "team1" or "team2" for error messages
 * @param {Array} squadPlayerIds - registered squad player IDs
 */
const validateTeamXI = (xi, teamLabel, squadPlayerIds) => {
  // Exactly 11 players
  if (!xi || xi.length !== 11) {
    throw new BadRequestError(
      `${teamLabel} must have exactly 11 players — got ${xi?.length ?? 0}`
    );
  }

  const playerIds = xi.map((p) => p.player.toString());

  // No duplicates
  const unique = new Set(playerIds);
  if (unique.size !== 11) {
    throw new BadRequestError(`${teamLabel} has duplicate players`);
  }

  // All players must be from squad
  const squadIds = squadPlayerIds.map((id) => id.toString());
  const notInSquad = playerIds.filter((id) => !squadIds.includes(id));
  if (notInSquad.length > 0) {
    throw new BadRequestError(
      `${teamLabel} has players not in registered squad: ${notInSquad.join(", ")}`
    );
  }

  // Exactly 1 captain
  const captains = xi.filter((p) => p.isCaptain);
  if (captains.length !== 1) {
    throw new BadRequestError(
      `${teamLabel} must have exactly 1 captain — got ${captains.length}`
    );
  }

  // Exactly 1 wicket keeper
  const keepers = xi.filter((p) => p.isWicketKeeper);
  if (keepers.length !== 1) {
    throw new BadRequestError(
      `${teamLabel} must have exactly 1 wicket keeper — got ${keepers.length}`
    );
  }
};

/**
 * Select Playing XI for both teams.
 * @param {string} matchId - Match ObjectId
 * @param {object} payload - { team1: [...], team2: [...] }
 * @param {string} userId - audit
 * @returns {Promise<object>} updated match document
 * @throws {NotFoundError} | {BadRequestError}
 */
export const selectPlayingXI = async (matchId, payload, userId) => {
  const match = await matchRepository.findById(matchId);

  if (!match) throw new NotFoundError("Match not found");

  // Match must be in TOSS_COMPLETED state
  if (match.status !== MATCH_STATUS.TOSS_COMPLETED) {
    throw new BadRequestError(
      `Playing XI can only be selected when match is in TOSS_COMPLETED state — current: ${match.status}`
    );
  }

  // Both XIs required
  if (!payload.team1 || !payload.team2) {
    throw new BadRequestError("Both team1 and team2 playing XI are required");
  }

  // Get squad player IDs for both teams
  const team1SquadIds = match.team1.squadPlayers ?? [];
  const team2SquadIds = match.team2.squadPlayers ?? [];

  // Validate both XIs
  validateTeamXI(payload.team1, "team1", team1SquadIds);
  validateTeamXI(payload.team2, "team2", team2SquadIds);

  // Persist and transition status
  const updated = await matchRepository.updateById(matchId, {
    "playingXI.team1": payload.team1,
    "playingXI.team2": payload.team2,
    status: MATCH_STATUS.PLAYING_XI_SELECTED,
    updatedBy: userId,
  });

  // ─── Socket.IO event ──────────────────────────────────────────────
  emitToMatch(matchId, "playingXI.updated", updated);
  emitToMatch(
    matchId,
    "players.updated",
    buildMatchPlayersPayload({ match: updated })
  );

  return updated;
};

/**
 * Get Playing XI for a match.
 * @param {string} matchId - Match ObjectId
 * @returns {Promise<object>} { team1: [...], team2: [...] }
 * @throws {NotFoundError}
 */
export const getPlayingXI = async (matchId) => {
  const match = await matchRepository.findById(matchId);

  if (!match) throw new NotFoundError("Match not found");

  return match.playingXI;
};