import { Router } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { responseCache } from "../cache/responseCache.js";
import { getHome } from "./home.controller.js";

/**
 * Home Routes
 * ─────────────────────────────────────────────────────────────────────
 * Single public endpoint. No auth, no validation.
 * Cache TTL: 10s — live match status baar baar change hota hai.
 *
 * Mount in app.js:
 *   app.use("/api/home", homeRouter);
 * ─────────────────────────────────────────────────────────────────────
 */

const router = Router();

/**
 * GET /api/home
 * { liveMatches, upcomingMatches, recentMatches }
 * Cache: 10s TTL
 */
router.get("/", responseCache(10), asyncHandler(getHome));

export default router;