import { SeriesModel } from "../models/series.model.js";

export class SeriesRepository {
  async create(payload) {
    return await SeriesModel.create(payload);
  }

  async findAll() {
    return await SeriesModel.find({
      isDeleted: false,
    });
  }

  async findById(seriesId) {
    return await SeriesModel.findOne({
      _id: seriesId,
      isDeleted: false,
    });
  }

  async findByName(name) {
    return await SeriesModel.findOne({
      name,
      isDeleted: false,
    });
  }

  async findBySeason(season) {
    return await SeriesModel.findOne({
      season,
      isDeleted: false,
    });
  }

  async update(seriesId, payload) {
    return await SeriesModel.findOneAndUpdate(
      {
        _id: seriesId,
        isDeleted: false,
      },
      payload,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async softDelete(seriesId) {
    return await SeriesModel.findOneAndUpdate(
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

export default SeriesRepository;
