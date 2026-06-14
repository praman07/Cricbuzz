import SeriesRepository from "../../repository/series.repository.js";
import ConflictError from "../../shared/errors/conflict.error.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import SeriesDto from "./dto/series.dto.js";

export default class SeriesService {
  constructor() {
    this.seriesRepository = new SeriesRepository();
  }

  async createSeries(payload) {
    const existingSeries = await this.seriesRepository.findByName(payload.name);

    if (existingSeries) {
      throw new ConflictError("Series name already exists");
    }

    const existingSeason = await this.seriesRepository.findBySeason(
      payload.season,
    );

    if (existingSeason) {
      throw new ConflictError("Season already exists");
    }

    return await this.seriesRepository.create(payload);
  }

  async getAllSeries() {
    const series = await this.seriesRepository.findAll();

    return SeriesDto.toResponseList(series);
  }

  async getSeriesById(seriesId) {
    const series = await this.seriesRepository.findById(seriesId);

    if (!series) {
      throw new NotFoundError("Series not found");
    }

    return SeriesDto.toResponse(series);
  }

  async updateSeries(seriesId, payload) {
    const series = await this.seriesRepository.findById(seriesId);

    if (!series) {
      throw new NotFoundError("Series not found");
    }

    if (payload.name) {
      const existingSeries = await this.seriesRepository.findByName(
        payload.name,
      );

      if (existingSeries && existingSeries._id.toString() !== seriesId) {
        throw new ConflictError("Series name already exists");
      }
    }

    if (payload.season) {
      const existingSeason = await this.seriesRepository.findBySeason(
        payload.season,
      );

      if (existingSeason && existingSeason._id.toString() !== seriesId) {
        throw new ConflictError("Season already exists");
      }
    }

    return await this.seriesRepository.update(seriesId, payload);
  }

  async deleteSeries(seriesId) {
    const series = await this.seriesRepository.findById(seriesId);

    if (!series) {
      throw new NotFoundError("Series not found");
    }

    return await this.seriesRepository.softDelete(seriesId);
  }
}
