import { z } from "zod";
import { SERIES_STATUS } from "../../../shared/constants/series.constant.js";

// Validation schema for creating a series
export const createSeriesSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    shortName: z.string().trim().min(1),
    season: z.string().trim().min(1),
    status: z.enum(Object.values(SERIES_STATUS)).optional(),
    logo: z.string().optional(),
  }),
});

// Validation schema for updating a series
export const updateSeriesSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    shortName: z.string().trim().min(1).optional(),
    season: z.string().trim().min(1).optional(),
    status: z.enum(Object.values(SERIES_STATUS)).optional(),
    logo: z.string().optional(),
  }),
});

// Validation schema for series id route parameter
export const seriesIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
});
