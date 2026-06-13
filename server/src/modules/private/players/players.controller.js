import { createPlayerService } from "./players.service.js";
import { StatusCodes } from "http-status-codes";

export const createPlayerController = async (req, res) => {
  let data = req.body;
  let player = await createPlayerService(data);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Player created successfully",
    data: player,
  });
};
