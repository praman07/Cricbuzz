import { Router } from "express";
import SeriesController from "./series.controller.js";
import { createSeriesSchema, updateSeriesSchema } from "./validators/series.validator.js";
import validateRequest from "../../shared/middlewares/validateRequest.js";

const router = Router();
const seriesController = new SeriesController();

router.post(
  "/",
  validateRequest(createSeriesSchema),
  seriesController.createSeries.bind(seriesController),
);

router.get("/", seriesController.getAllSeries.bind(seriesController));

router.get("/:id", seriesController.getSeriesById.bind(seriesController));

router.patch(
    "/:id",
    validateRequest(updateSeriesSchema),
    seriesController.updateSeries.bind(seriesController),
  );

router.delete("/:id", seriesController.deleteSeries.bind(seriesController));

export default router;
