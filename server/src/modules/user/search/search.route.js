import { Router } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { responseCache } from "../cache/responseCache.js";
import { search } from "./search.controller.js";

/**
 * Search Routes (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Single endpoint — cross-entity search.
 * Cache TTL: 30s — data mostly stable hai.
 *
 * Mount in app.js:
 *   app.use("/api/search", searchPublicRouter);
 *
 * Usage: GET /api/search?q=virat
 * ─────────────────────────────────────────────────────────────────────
 */

const router = Router();

/**
 * GET /api/search?q=...
 * Min 2 chars required. Max 10 results per entity.
 * Cache: 30s TTL
 */
router.get(
  "/",
  responseCache(30),
  asyncHandler(search)
);

export default router;