import express from "express";
import {
  createPlayerController,
  getAllPlayersController,
  getPlayerByIdController,
  updatePlayerByIdController,
  deletePlayerByIdController,
} from "./players.controller.js";

const playerRouter = express.Router();

/**
 * @description Create a new player
 * @route POST /api/players
 * @access Private
 * @returns {Object} Player object
 */
playerRouter.post("/", createPlayerController);

/**
 * @description Get all players
 * @route GET /api/players
 * @access Private
 * @returns {Object} Array of player objects
 */
playerRouter.get("/", getAllPlayersController);

/**
 * @description Get a player by id
 * @route GET /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
playerRouter.get("/:id", getPlayerByIdController);

/**
 * @description Update a player by id
 * @route PATCH /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
playerRouter.patch("/:id", updatePlayerByIdController);

/**
 * @description Delete a player by id
 * @route DELETE /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
playerRouter.delete("/:id", deletePlayerByIdController);

export default playerRouter;
