import { SeriesModel } from "../models/series.model.js";

export default class SeriesRepository {
  async create(payload) {
    return SeriesModel.create(payload);
  }

  async findAll() {
    return SeriesModel.find({
      isDeleted: false,
    });
  }

  async findById(seriesId) {
    return SeriesModel.findOne({
      _id: seriesId,
      isDeleted: false,
    });
  }

  async findByName(name) {
    return SeriesModel.findOne({
      name,
      isDeleted: false,
    });
  }

  async findBySeason(season) {
    return SeriesModel.findOne({
      season,
      isDeleted: false,
    });
  }

  async update(seriesId, payload) {
    return SeriesModel.findOneAndUpdate(
      {
        _id: seriesId,
        isDeleted: false,
      },
      payload,
      {
        new: true,
      },
    );
  }

  async softDelete(seriesId) {
    return SeriesModel.findOneAndUpdate(
      {
        _id: seriesId,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );
  }
}