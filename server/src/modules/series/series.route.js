import { Router } from "express";
import SeriesController from "./series.controller.js";

import {
  createSeriesSchema,
  updateSeriesSchema,
  seriesIdParamSchema,
} from "./validators/series.validator.js";

import validateRequest from "../../shared/middlewares/validateRequest.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import { ROLES } from "../../shared/constants/role.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../shared/middlewares/auth.middleware.js";

const router = Router();
const seriesController = new SeriesController();

// All series routes require authentication
router.use(authMiddleware);

// Get all series
router.get(
  "/",
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  asyncHandler(seriesController.getAllSeries.bind(seriesController)),
);

// Get series by id
router.get(
  "/:id",
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRequest(seriesIdParamSchema),
  asyncHandler(seriesController.getSeriesById.bind(seriesController)),
);

// Create a new series
router.post(
  "/",
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRequest(createSeriesSchema),
  asyncHandler(seriesController.createSeries.bind(seriesController)),
);

// Update an existing series
router.patch(
  "/:id",
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRequest(seriesIdParamSchema),
  validateRequest(updateSeriesSchema),
  asyncHandler(seriesController.updateSeries.bind(seriesController)),
);

// Soft delete a series
router.delete(
  "/:id",
  authorizeRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRequest(seriesIdParamSchema),
  asyncHandler(seriesController.deleteSeries.bind(seriesController)),
);

export default router;
