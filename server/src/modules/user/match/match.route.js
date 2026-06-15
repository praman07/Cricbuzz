import { Router } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { responseCache } from "../cache/responseCache.js";
import * as matchController from "./match.controller.js";

/**
 * Match Routes (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated, cached GET endpoints for fan-facing match data.
 * Cache TTL: 10s — live score data baar baar change hota hai.
 *
 * NOTE: Specific routes (/:matchId/center, /:matchId/scorecard)
 * pehle register karo — warna /:matchId match kar leta hai.
 *
 * Mount in app.js:
 *   app.use("/api/matches", matchPublicRouter);
 * ─────────────────────────────────────────────────────────────────────
 */

const router = Router();

/**
 * GET /api/matches
 * Saare matches. Query: ?status=live|upcoming|completed
 * Cache: 10s TTL
 */
router.get(
  "/",
  responseCache(10),
  asyncHandler(matchController.getMatches)
);

/**
 * GET /api/matches/:matchId/center
 * Live match center — matchInfo + liveScore + playingXI + result.
 * Cache: 10s TTL
 * NOTE: /:matchId se pehle rakha hai — warna shadow ho jaata
 */
router.get(
  "/:matchId/center",
  responseCache(10),
  asyncHandler(matchController.getMatchCenter)
);

/**
 * GET /api/matches/:matchId/scorecard
 * Innings breakdown — { innings1, innings2 }.
 * Cache: 10s TTL
 */
router.get(
  "/:matchId/scorecard",
  responseCache(10),
  asyncHandler(matchController.getScorecard)
);

/**
 * GET /api/matches/:matchId
 * Match details + scores.
 * Cache: 10s TTL
 */
router.get(
  "/:matchId",
  responseCache(10),
  asyncHandler(matchController.getMatch)
);

export default router;