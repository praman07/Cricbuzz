import SeriesService from "./series.service.js";

export default class SeriesController {
  constructor() {
    this.seriesService = new SeriesService();
  }

  // Create a new series
  async createSeries(req, res, next) {
    try {
      const series = await this.seriesService.createSeries(req.body);

      return res.status(201).json({
        success: true,
        data: series,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all series
  async getAllSeries(req, res, next) {
    try {
      const series = await this.seriesService.getAllSeries();

      return res.status(200).json({
        success: true,
        data: series,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get series by id
  async getSeriesById(req, res, next) {
    try {
      const { id } = req.params;

      const series = await this.seriesService.getSeriesById(id);

      return res.status(200).json({
        success: true,
        data: series,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update series details
  async updateSeries(req, res, next) {
    try {
      const { id } = req.params;

      const updatedSeries = await this.seriesService.updateSeries(id, req.body);

      return res.status(200).json({
        success: true,
        data: updatedSeries,
      });
    } catch (error) {
      next(error);
    }
  }

  // Soft delete a series
  async deleteSeries(req, res, next) {
    try {
      const { id } = req.params;

      const deletedSeries = await this.seriesService.deleteSeries(id);

      return res.status(200).json({
        success: true,
        data: deletedSeries,
      });
    } catch (error) {
      next(error);
    }
  }
}
