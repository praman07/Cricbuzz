import { Router } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { responseCache } from "../cache/responseCache.js";
import * as playerController from "./player.controller.js";

/**
 * Player Routes (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated, cached GET endpoints.
 * Cache TTL: 60s — players rarely change.
 *
 * Mount in app.js:
 *   app.use("/api/players", playerPublicRouter);
 * ─────────────────────────────────────────────────────────────────────
 */

const router = Router();

/**
 * GET /api/players
 * Saare active players.
 * Cache: 60s TTL
 */
router.get(
  "/",
  responseCache(60),
  asyncHandler(playerController.getPlayers)
);

/**
 * GET /api/players/:playerId
 * Player details by ID.
 * Cache: 60s TTL
 */
router.get(
  "/:playerId",
  responseCache(60),
  asyncHandler(playerController.getPlayerById)
);

export default router;