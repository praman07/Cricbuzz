import { sendSuccess } from "../shared/respond.js";
import * as homeService from "./home.service.js";

/**
 * Controller Layer — Home (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Single endpoint. Response 10s ke liye cache hota hai route level pe —
 * ye controller sirf cache miss pe hit hota hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * GET /api/home
 * Live, upcoming, aur recently completed matches return karta hai.
 * Access: Public (no auth) — Cache: 10s TTL
 */
export const getHome = async (req, res) => {
  const { liveMatches, upcomingMatches, recentMatches } =
    await homeService.getHomeFeed();

  return sendSuccess(res, { liveMatches, upcomingMatches, recentMatches });
};