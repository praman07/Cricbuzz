import express from "express";
import {
  createPlayerController,
  getPlayersController,
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

export default playerRouter;
