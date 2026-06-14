import { z } from "zod";
import { SERIES_STATUS } from "../../../shared/constants/series.constant.js";

export const createSeriesSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    shortName: z.string().trim().min(1),
    season: z.string().trim().min(1),
    status: z.enum(Object.values(SERIES_STATUS)).optional(),
    logo: z.string().optional(),
  }),
});

export const updateSeriesSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    shortName: z.string().trim().min(1).optional(),
    season: z.string().trim().min(1).optional(),
    status: z.enum(Object.values(SERIES_STATUS)).optional(),
    logo: z.string().optional(),
  }),
});

export const seriesIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
});
