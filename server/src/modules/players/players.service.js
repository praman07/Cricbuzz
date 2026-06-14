import PlayersRepo from "../../repository/players.repository.js";
import { createPlayerDto, updatePlayerDto } from "./dto/player.dto.js";
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import playerRoleConstant from "../../shared/constants/playerRole.constant.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";

export default class PlayersService {
  constructor() {
    this.playersRepo = new PlayersRepo();
  }

  async createPlayer(data) {
    const dto = createPlayerDto(data);

    if (!dto.name || !dto.image || !dto.role || !dto.country) {
      throw new BadRequestError("All fields are required");
    }

    if (!Object.values(playerRoleConstant).includes(dto.role)) {
      throw new BadRequestError("Invalid role");
    }

    const isAlreadyExists = await this.playersRepo.findByName(dto.name);
    if (isAlreadyExists) {
      throw new BadRequestError("Player already exists");
    }

    return await this.playersRepo.create(dto);
  }

  async getAllPlayers() {
    const players = await this.playersRepo.findAll();
    if (!players || players.length === 0) {
      throw new NotFoundError("No players found");
    }
    return players;
  }

  async getPlayerById(id) {
    const player = await this.playersRepo.findById(id);
    if (!player) {
      throw new NotFoundError("Player not found");
    }
    return player;
  }

  async updatePlayerById(id, data) {
    const isPlayerExists = await this.playersRepo.findById(id);
    if (!isPlayerExists) {
      throw new NotFoundError("Player not found");
    }

    const dto = updatePlayerDto(data);
    return await this.playersRepo.update(id, dto);
  }

  async deletePlayerById(id) {
    const isPlayerExists = await this.playersRepo.findById(id);
    if (!isPlayerExists) {
      throw new NotFoundError("Player not found");
    }

    return await this.playersRepo.delete(id);
  }
}
