import playerModel from "../models/players.model.js";

export default class PlayersRepo {
  async create(payload) {
    return await playerModel.create(payload);
  }

  async findAll() {
    return await playerModel.find({ isDeleted: false }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await playerModel.findOne({ _id: id, isDeleted: false });
  }

  async findByName(name) {
    return await playerModel.findOne({ name, isDeleted: false });
  }

  async update(id, payload) {
    return await playerModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true, runValidators: true },
    );
  }

  async delete(id) {
    return await playerModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
  }

  async exists(id) {
    const player = await playerModel.exists({ _id: id, isDeleted: false });
    return Boolean(player);
  }

}
