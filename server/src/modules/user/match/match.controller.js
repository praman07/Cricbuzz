import { sendSuccess, sendList } from "../shared/respond.js";
import * as matchService from "./match.service.js";

/**
 * Controller Layer — Match (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Unauthenticated read-only handlers. Responses cache hote hain
 * route level pe (10s TTL) — controller sirf cache miss pe hit hota hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * GET /api/matches
 * Saare matches — optional ?status=live|upcoming|completed filter.
 * Access: Public — Cache: 10s
 */
export const getMatches = async (req, res) => {
  const matches = await matchService.getMatches(req.query.status);

  return sendList(res, matches);
};

/**
 * GET /api/matches/:matchId
 * Match details + scores.
 * Access: Public — Cache: 10s
 */
export const getMatch = async (req, res) => {
  const data = await matchService.getMatch(req.params.matchId);

  return sendSuccess(res, data);
};

/**
 * GET /api/matches/:matchId/center
 * Live match center — matchInfo + liveScore + playingXI + result.
 * Access: Public — Cache: 10s
 */
export const getMatchCenter = async (req, res) => {
  const data = await matchService.getMatchCenter(req.params.matchId);

  return sendSuccess(res, data);
};

/**
 * GET /api/matches/:matchId/scorecard
 * Innings breakdown — { innings1, innings2 }.
 * Access: Public — Cache: 10s
 */
export const getScorecard = async (req, res) => {
  const data = await matchService.getScorecard(req.params.matchId);

  return sendSuccess(res, data);
};