import mongoose from "mongoose";
import { SERIES_STATUS } from "../shared/constants/series.constant.js";

// ────────────────────────────────────────────────────────────
// Series Schema
// Stores cricket series information such as
// IPL, World Cup, Border-Gavaskar Trophy, etc.
// ────────────────────────────────────────────────────────────

const seriesSchema = new mongoose.Schema(
  {
    // Full series name
    // Example: Indian Premier League 2026
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Short series name
    // Example: IPL
    shortName: {
      type: String,
      required: true,
      trim: true,
    },

    // Season identifier
    // Example: 2026
    season: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Current status of the series
    // Allowed values are defined in SERIES_STATUS
    status: {
      type: String,
      enum: Object.values(SERIES_STATUS),
      default: SERIES_STATUS.UPCOMING,
    },

    // Series logo/image URL
    logo: {
      type: String,
    },

    // Soft delete flag
    // Deleted records are not permanently removed
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // User who created the series
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // User who last updated the series
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // Automatically adds:
    // createdAt
    // updatedAt
    timestamps: true,
  },
);

// Series Model
export const SeriesModel = mongoose.model("Series", seriesSchema);
