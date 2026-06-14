import {
  createPlayerService,
  getAllPlayersService,
  getPlayerByIdService,
  updatePlayerByIdService,
  deletePlayerByIdService,
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

/**
 * @description Get a player by id
 * @route GET /api/players/:id
 * @access Private
 * @returns {Object} Player object
 */
export const getPlayerByIdController = async (req, res) => {
  let { id } = req.params;
  let player = await getPlayerByIdService(id);
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
  let updatedPlayer = await updatePlayerByIdService(id, data);

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
  let deletedPlayer = await deletePlayerByIdService(id);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Player deleted successfully",
  });
};
