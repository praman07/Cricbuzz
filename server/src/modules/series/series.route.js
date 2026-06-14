import { Router } from "express";
import SeriesController from "./series.controller";

const router = Router();
const seriesController = new SeriesController();

router.post("/", seriesController.createSeries.bind(seriesController));

router.get("/", seriesController.getAllSeries.bind(seriesController));

router.get("/:id", seriesController.getSeriesById.bind(seriesController));

router.patch("/:id", seriesController.updateSeries.bind(seriesController));

router.delete("/:id", seriesController.deleteSeries.bind(seriesController));

export default router;
