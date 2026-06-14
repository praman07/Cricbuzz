import { sendSuccess, sendList } from "../shared/respond.js";
import * as teamService from "./team.service.js";

/**
 * Controller Layer — Team (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated read-only handlers. Cache: 60s TTL.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * GET /api/teams
 * Saari active teams with squad.
 * Access: Public — Cache: 60s
 */
export const getTeams = async (req, res) => {
  const teams = await teamService.getTeams();
  return sendList(res, teams);
};

/**
 * GET /api/teams/:teamId
 * Team details with populated squad.
 * Access: Public — Cache: 60s
 */
export const getTeamById = async (req, res) => {
  const team = await teamService.getTeamById(req.params.teamId);
  return sendSuccess(res, team);
};