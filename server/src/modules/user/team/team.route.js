import { Router } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { responseCache } from "../cache/responseCache.js";
import * as teamController from "./team.controller.js";

/**
 * Team Routes (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated, cached GET endpoints.
 * Cache TTL: 60s — teams rarely change.
 *
 * Mount in app.js:
 *   app.use("/api/teams", teamPublicRouter);
 * ─────────────────────────────────────────────────────────────────────
 */

const router = Router();

/**
 * GET /api/teams
 * Saari active teams.
 * Cache: 60s TTL
 */
router.get(
  "/",
  responseCache(60),
  asyncHandler(teamController.getTeams)
);

/**
 * GET /api/teams/:teamId
 * Team details with populated squad.
 * Cache: 60s TTL
 */
router.get(
  "/:teamId",
  responseCache(60),
  asyncHandler(teamController.getTeamById)
);

export default router;