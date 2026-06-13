import { StatusCodes } from "http-status-codes";
import * as teamService from "./team.service.js";
import { createTeamDto, updateTeamDto } from "./dto/team.dto.js";

/**
 * Controller Layer — Team (Admin)
 * -----------------------------------------------------------------------
 * Thin adapters: extract input from req.body/req.params, call the
 * service, serialise the response. All async errors are forwarded to
 * Errorhandler via asyncHandler in the route definitions — no try/catch
 * here.
 *
 * NOTE: validateRequest only checks shapes via schema.parse() and does
 * NOT attach a transformed result to req.validated. Controllers read
 * raw req.body/req.params — Zod transforms (.trim(), defaults, etc.)
 * are NOT applied to these values. Validation here is gatekeeping only,
 * not data shaping. If a field needs guaranteed trimming/defaults,
 * apply it explicitly in the service layer.
 * -----------------------------------------------------------------------
 */

/**
 * POST /api/teams
 * Create a new team.
 * Access: SUPER_ADMIN | ADMIN
 */
export const createTeam = async (req, res) => {
  const team = await teamService.createTeam(createTeamDto(req.body), req.user.id);

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
    req.user.id
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
  const team = await teamService.deleteTeam(req.params.id, req.user.id);

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