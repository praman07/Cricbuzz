import { StatusCodes } from "http-status-codes";
import * as teamService from "./team.service.js";
import { createTeamDto, updateTeamDto } from "./dto/team.dto.js";

/**
 * Team Controller (Admin + Public)
 * ─────────────────────────────────────────────────────────────────────
 * PUBLIC  handlers: getTeams, getTeamById (no auth, responses cached)
 * ADMIN   handlers: createTeam, updateTeam, deleteTeam, getSquad,
 *                   addPlayerToSquad, removePlayerFromSquad
 *
 * All async errors forwarded to Errorhandler via asyncHandler — no
 * try/catch here. Raw req.body/req.params used since validateRequest
 * does not attach req.validated; DTOs whitelist fields before service.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─── Public Handlers ─────────────────────────────────────────────────

/**
 * GET /api/teams
 * List all active teams.
 * Access: Public (no auth) — Cache: 60s
 */
export const getTeams = async (req, res) => {
  const teams = await teamService.getTeams();

  return res.status(StatusCodes.OK).json({
    success: true,
    count: teams.length,
    data: teams,
  });
};

/**
 * GET /api/teams/:id
 * Get team details by ID (with populated squad).
 * Access: Public (no auth) — Cache: 60s
 */
export const getTeamById = async (req, res) => {
  const team = await teamService.getTeamById(req.params.id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: team,
  });
};

// ─── Admin Handlers ───────────────────────────────────────────────────

/**
 * POST /api/teams
 * Create a new team.
 * Access: SUPER_ADMIN | ADMIN
 */
export const createTeam = async (req, res) => {
  const team = await teamService.createTeam(createTeamDto(req.body), req.user._id);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: team,
  });
};

/**
 * PATCH /api/teams/:id
 * Update an existing team (partial update).
 * Access: SUPER_ADMIN | ADMIN
 */
export const updateTeam = async (req, res) => {
  const team = await teamService.updateTeam(
    req.params.id,
    updateTeamDto(req.body),
    req.user._id
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    data: team,
  });
};

/**
 * DELETE /api/teams/:id
 * Soft-delete a team.
 * Access: SUPER_ADMIN | ADMIN
 */
export const deleteTeam = async (req, res) => {
  const team = await teamService.deleteTeam(req.params.id, req.user._id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: team,
  });
};

/**
 * GET /api/teams/:teamId/squad
 * Get a team's squad (list of players).
 * Access: SUPER_ADMIN | ADMIN
 */
export const getSquad = async (req, res) => {
  const squad = await teamService.getSquad(req.params.teamId);

  return res.status(StatusCodes.OK).json({
    success: true,
    count: squad.length,
    data: squad,
  });
};

/**
 * POST /api/teams/:teamId/squad
 * Add a player to a team's squad.
 * Access: SUPER_ADMIN | ADMIN
 */
export const addPlayerToSquad = async (req, res) => {
  const team = await teamService.addPlayerToSquad(
    req.params.teamId,
    req.body.playerId
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    data: team,
  });
};

/**
 * DELETE /api/teams/:teamId/squad/:playerId
 * Remove a player from a team's squad.
 * Access: SUPER_ADMIN | ADMIN
 */
export const removePlayerFromSquad = async (req, res) => {
  const team = await teamService.removePlayerFromSquad(
    req.params.teamId,
    req.params.playerId
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    data: team,
  });
};