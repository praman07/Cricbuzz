import { sendSuccess } from "../shared/respond.js";
import * as searchService from "./search.service.js";

/**
 * Controller Layer — Search (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Single search endpoint — cross-entity.
 * Cache: 30s TTL — data mostly stable hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * GET /api/search?q=...
 * Players, teams, series mein search karo.
 * Access: Public — Cache: 30s
 */
export const search = async (req, res) => {
  const data = await searchService.search(req.query.q);
  return sendSuccess(res, data);
};