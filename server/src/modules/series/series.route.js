import { Router } from "express";
import SeriesController from "./series.controller.js";
import {
  createSeriesSchema,
  updateSeriesSchema,
} from "./validators/series.validator.js";
import validateRequest from "../../shared/middlewares/validateRequest.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

const router = Router();
const seriesController = new SeriesController();

router.post(
  "/",
  validateRequest(createSeriesSchema),
  asyncHandler(seriesController.createSeries.bind(seriesController)),
);

router.get(
  "/",
  asyncHandler(seriesController.getAllSeries.bind(seriesController)),
);

router.get(
  "/:id",
  asyncHandler(seriesController.getSeriesById.bind(seriesController)),
);

router.patch(
  "/:id",
  validateRequest(updateSeriesSchema),
  asyncHandler(seriesController.updateSeries.bind(seriesController)),
);

router.delete(
  "/:id",
  asyncHandler(seriesController.deleteSeries.bind(seriesController)),
);

export default router;
