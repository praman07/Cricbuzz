import express from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import validateRequest from "../../shared/middlewares/validateRequest.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../shared/middlewares/auth.middleware.js";
// import { responseCache } from "../../cache/responseCache.js";
import { ROLES } from "../../shared/constants/role.js";
import {
  createTeamSchema,
  updateTeamSchema,
  teamIdParamSchema,
  addPlayerToSquadSchema,
  removePlayerFromSquadSchema,
  getSquadSchema,
} from "./validators/team.validator.js";
import * as adminController from "./team.controller.js";

/**
 * Team Routes
 * ─────────────────────────────────────────────────────────────────────
 * PUBLIC  (no auth, cached)   — GET /api/teams, GET /api/teams/:id
 * ADMIN   (auth + role check) — POST, PATCH, DELETE /api/teams
 *                               GET/POST/DELETE /api/teams/:teamId/squad
 *
 * Public routes are registered FIRST so Express's first-match-wins
 * serves cached unauthenticated GETs without reaching admin handlers.
 * ─────────────────────────────────────────────────────────────────────
 */

const router = express.Router();

// ─── Public Routes (no auth) ─────────────────────────────────────────

/**
 * GET /api/teams
 * List all active teams.
 * Cache: 60s TTL
 */
router.get(
  "/",
  // responseCache(60),
  asyncHandler(adminController.getTeams),
);

/**
 * GET /api/teams/:id
 * Get team details by ID (with populated squad).
 * Cache: 60s TTL
 */
router.get(
  "/:id",
  // responseCache(60),
  validateRequest(teamIdParamSchema),
  asyncHandler(adminController.getTeamById),
);

// ─── Admin Routes (auth required) ────────────────────────────────────

/**
 * POST /api/teams
 * Create a new team.
 * Access: SUPER_ADMIN | ADMIN
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest(createTeamSchema),
  asyncHandler(adminController.createTeam),
);

/**
 * PATCH /api/teams/:id
 * Update an existing team (partial update).
 * Access: SUPER_ADMIN | ADMIN
 */
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest(updateTeamSchema),
  asyncHandler(adminController.updateTeam),
);

/**
 * DELETE /api/teams/:id
 * Soft-delete a team.
 * Access: SUPER_ADMIN | ADMIN
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest(teamIdParamSchema),
  asyncHandler(adminController.deleteTeam),
);

/**
 * GET /api/teams/:teamId/squad
 * Get a team's squad.
 * Access: SUPER_ADMIN | ADMIN
 */
router.get(
  "/:teamId/squad",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest(getSquadSchema),
  asyncHandler(adminController.getSquad),
);

/**
 * POST /api/teams/:teamId/squad
 * Add a player to a team's squad.
 * Access: SUPER_ADMIN | ADMIN
 */
router.post(
  "/:teamId/squad",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest(addPlayerToSquadSchema),
  asyncHandler(adminController.addPlayerToSquad),
);

/**
 * DELETE /api/teams/:teamId/squad/:playerId
 * Remove a player from a team's squad.
 * Access: SUPER_ADMIN | ADMIN
 */
router.delete(
  "/:teamId/squad/:playerId",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validateRequest(removePlayerFromSquadSchema),
  asyncHandler(adminController.removePlayerFromSquad),
);

export default router;
