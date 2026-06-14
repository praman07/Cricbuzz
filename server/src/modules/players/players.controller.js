import PlayersService from "./players.service.js";
import { StatusCodes } from "http-status-codes";

const playersService = new PlayersService();

/**
 * @description Create a new player
 * @route POST /api/players
 * @access Private
 * @returns {Object} Player object
 */
export const createPlayerController = async (req, res) => {
  let data = req.body;
  let player = await playersService.createPlayer(data);
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
  let players = await playersService.getAllPlayers();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Players fetched successfully",
    data: players,
  });
};

/**
 * @description Get a player by id
 * @route GET /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
export const getPlayerByIdController = async (req, res) => {
  let { id } = req.params;
  let player = await playersService.getPlayerById(id);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Player fetched successfully",
    data: player,
  });
};

/**
 * @description Update a player by id
 * @route PATCH /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
export const updatePlayerByIdController = async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  let updatedPlayer = await playersService.updatePlayerById(id, data);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Player updated successfully",
    data: updatedPlayer,
  });
};

/**
 * @description Delete a player by id
 * @route DELETE /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
export const deletePlayerByIdController = async (req, res) => {
  let { id } = req.params;
  await playersService.deletePlayerById(id);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Player deleted successfully",
  });
};
