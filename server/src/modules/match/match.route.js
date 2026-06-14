import express from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { authMiddleware, authorizeRoles } from "../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../shared/constants/role.js";
import * as matchController from "./match.controller.js";

/**
 * Match Routes
 * -----------------------------------------------------------------------
 * PUBLIC  (no auth)             — GET /api/match, GET /api/match/:id
 * ADMIN   (auth + role check)   — POST, PATCH, DELETE /api/match
 * -----------------------------------------------------------------------
 */

const router = express.Router();

// ─── Public Routes (no auth) ─────────────────────────────────────────

/**
 * GET /api/match
 * List all active matches. Supports ?status= and ?seriesId= filters.
 */
router.get(
  "/",
  asyncHandler(matchController.getMatches)
);

/**
 * GET /api/match/:id
 * Get match details by ID.
 */
router.get(
  "/:id",
  asyncHandler(matchController.getMatchById)
);

// ─── Admin Routes (auth required) ────────────────────────────────────

/**
 * POST /api/match
 * Create a new match.
 * Access: SUPER_ADMIN | ADMIN
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  asyncHandler(matchController.createMatch)
);

/**
 * PATCH /api/match/:id
 * Update an existing match (partial update).
 * Access: SUPER_ADMIN | ADMIN
 */
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  asyncHandler(matchController.updateMatch)
);

/**
 * DELETE /api/match/:id
 * Soft-delete a match.
 * Access: SUPER_ADMIN | ADMIN
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  asyncHandler(matchController.deleteMatch)
);

export default router;
