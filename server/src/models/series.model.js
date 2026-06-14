import mongoose from "mongoose";

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
      enum: ["UPCOMING", "LIVE", "COMPLETED"],
      default: "UPCOMING",
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