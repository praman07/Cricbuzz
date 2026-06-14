import express from "express";
import {
  createPlayerController,
  getAllPlayersController,
  getPlayerByIdController,
  updatePlayerByIdController,
  deletePlayerByIdController,
} from "./players.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../shared/middlewares/auth.middleware.js";
import validateRequest from "../../shared/middlewares/validateRequest.js";
import {
  createPlayerValidator,
  updatePlayerValidator,
} from "./validators/player.validator.js";
import { ROLES } from "../../shared/constants/role.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

const playerRouter = express.Router();

/**
 * @description Create a new player
 * @route POST /api/players
 * @access Private
 * @returns {Object} Player object
 */
playerRouter.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRequest(createPlayerValidator),
  asyncHandler(createPlayerController),
);

/**
 * @description Get all players
 * @route GET /api/players
 * @access public
 * @returns {Object} Array of player objects
 */
playerRouter.get("/", asyncHandler(getAllPlayersController));

/**
 * @description Get a player by id
 * @route GET /api/players/:id
 * @access public
 * @returns {Object} Player object
 */
playerRouter.get("/:id", asyncHandler(getPlayerByIdController));

/**
 * @description Update a player by id
 * @route PATCH /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
playerRouter.patch(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRequest(updatePlayerValidator),
  asyncHandler(updatePlayerByIdController),
);

/**
 * @description Delete a player by id
 * @route DELETE /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
playerRouter.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  asyncHandler(deletePlayerByIdController),
);

export default playerRouter;
