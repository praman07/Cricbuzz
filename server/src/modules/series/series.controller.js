import SeriesService from "./series.service";

export default class SeriesController {
  constructor() {
    this.seriesService = new SeriesService();
  }

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
