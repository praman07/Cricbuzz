import playerModel from "../../../models/players.model.js";
import BadRequestError from "../../../shared/errors/BadRequest.error.js";
import playerRoleConstant from "../../../shared/constants/playerRole.constant.js";

export const createPlayerService = async (data) => {
  // check all the data is present
  if (!data.name || !data.image || !data.role || !data.country) {
    throw new BadRequestError("All fields are required");
  }

  // check the role is valid
  if (!Object.values(playerRoleConstant).includes(data.role)) {
    throw new BadRequestError("Invalid role");
  }

  // check if player already exits
  let isAlreadyExists = await playerModel.findOne({ name: data.name });
  if (isAlreadyExists) {
    throw new BadRequestError("Player already exists");
  }

  let player = await playerModel.create({
    name: data.name,
    image: data.image,
    role: data.role,
    country: data.country,
    battingStyle: data.battingStyle,
    bowlingStyle: data.bowlingStyle,
  });
  return player;
};
