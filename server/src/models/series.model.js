import mongoose from "mongoose";
import { SERIES_STATUS } from "../shared/constants/series.constant";

const seriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shortName: {
      type: String,
      required: true,
      trim: true,
    },

    season: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(SERIES_STATUS),
      default: SERIES_STATUS.UPCOMING,
    },

    logo: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const SeriesModel = mongoose.model("Series", seriesSchema);