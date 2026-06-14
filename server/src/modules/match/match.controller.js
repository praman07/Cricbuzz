import { StatusCodes } from "http-status-codes";
import * as matchService from "./match.service.js";

/**
 * Match Controller
 * -----------------------------------------------------------------------
 * HTTP adapter — receives req/res, delegates to the service layer.
 * Async errors forwarded to Errorhandler via asyncHandler in routes.
 * -----------------------------------------------------------------------
 */

/**
 * GET /api/match
 * List all active matches. Supports ?status= and ?seriesId= filters.
 */
export const getMatches = async (req, res) => {
  const matches = await matchService.getMatches(req.query);

  return res.status(StatusCodes.OK).json({
    success: true,
    count: matches.length,
    data: matches,
  });
};

/**
 * GET /api/match/:id
 * Get match details by ID (with populated refs).
 */
export const getMatchById = async (req, res) => {
  const match = await matchService.getMatchById(req.params.id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: match,
  });
};

/**
 * POST /api/match
 * Create a new match.
 * Access: SUPER_ADMIN | ADMIN
 */
export const createMatch = async (req, res) => {
  const match = await matchService.createMatch(req.body, req.user.id);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: match,
  });
};

/**
 * PATCH /api/match/:id
 * Update an existing match (partial update).
 * Access: SUPER_ADMIN | ADMIN
 */
export const updateMatch = async (req, res) => {
  const match = await matchService.updateMatch(
    req.params.id,
    req.body,
    req.user.id
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    data: match,
  });
};

/**
 * DELETE /api/match/:id
 * Soft-delete a match.
 * Access: SUPER_ADMIN | ADMIN
 */
export const deleteMatch = async (req, res) => {
  const match = await matchService.deleteMatch(req.params.id, req.user.id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: match,
  });
};
