import SeriesRepository from "../../repository/series.repository.js";
import ConflictError from "../../shared/errors/conflict.error.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";
import SeriesDto from "./dto/series.dto.js";

// Series Service
// Handles all business logic related to series management.
export default class SeriesService {
  constructor() {
    this.seriesRepository = new SeriesRepository();
  }

  // Create a new series
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

    const series = await this.seriesRepository.create(payload);

    return SeriesDto.toResponse(series);
  }

  // Get all active series
  async getAllSeries() {
    const series = await this.seriesRepository.findAll();

    return SeriesDto.toResponseList(series);
  }

  // Get series details by id
  async getSeriesById(seriesId) {
    const series = await this.seriesRepository.findById(seriesId);

    if (!series) {
      throw new NotFoundError("Series not found");
    }

    return SeriesDto.toResponse(series);
  }

  // Update an existing series
  async updateSeries(seriesId, payload) {
    const series = await this.seriesRepository.findById(seriesId);

    if (!series) {
      throw new NotFoundError("Series not found");
    }

    // Validate unique series name
    if (payload.name) {
      const existingSeries = await this.seriesRepository.findByName(
        payload.name,
      );

      if (existingSeries && existingSeries._id.toString() !== seriesId) {
        throw new ConflictError("Series name already exists");
      }
    }

    // Validate unique season
    if (payload.season) {
      const existingSeason = await this.seriesRepository.findBySeason(
        payload.season,
      );

      if (existingSeason && existingSeason._id.toString() !== seriesId) {
        throw new ConflictError("Season already exists");
      }
    }

    const updatedSeries = await this.seriesRepository.update(seriesId, payload);

    return SeriesDto.toResponse(updatedSeries);
  }

  // Soft delete a series
  async deleteSeries(seriesId) {
    // Check if the series exists
    const series = await this.seriesRepository.findById(seriesId);

    if (!series) {
      throw new NotFoundError("Series not found");
    }

    // TODO:
    // Prevent deletion when matches are associated
    // with this series.

    // Soft delete the series
    const deletedSeries = await this.seriesRepository.softDelete(seriesId);

    return SeriesDto.toResponse(deletedSeries);
  }
}
