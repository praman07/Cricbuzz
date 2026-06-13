import {
  createPlayerService,
  getAllPlayersService,
} from "./players.service.js";
import { StatusCodes } from "http-status-codes";

/**
 * @description Create a new player
 * @route POST /api/players
 * @access Private
 * @returns {Object} Player object
 */
export const createPlayerController = async (req, res) => {
  let data = req.body;
  let player = await createPlayerService(data);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Player created successfully",
    data: player,
  });
};

/**
 * @description Get all players
 * @route GET /api/players
 * @access Private
 * @returns {Object} Array of player objects
 */
export const getAllPlayersController = async (req, res) => {
  let players = await getAllPlayersService();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Players fetched successfully",
    data: players,
  });
};
