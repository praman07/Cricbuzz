import { Schema, model } from "mongoose";
import { MATCH_STATUS } from "../shared/constants/matchStatus.js";

const playingPlayerSchema = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    isCaptain: {
      type: Boolean,
      default: false,
    },
    isWicketKeeper: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const matchSchema = new Schema(
  {
    seriesId: {
      type: Schema.Types.ObjectId,
      ref: "Series",
      required: [true, "Series is required"],
    },
    matchNumber: {
      type: String,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    status: {
      type: String,
      enum: Object.values(MATCH_STATUS),
      default: MATCH_STATUS.UPCOMING,
    },
    team1: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team 1 is required"],
    },
    team2: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team 2 is required"],
    },
    tossWinner: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    tossDecision: {
      type: String,
      enum: ["BAT", "BOWL"],
    },
    playingXI: {
      team1: [playingPlayerSchema],
      team2: [playingPlayerSchema],
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    result: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ─── Indexes ───────────────────────────────────────────────────────────────
matchSchema.index({ status: 1, startTime: 1, isDeleted: 1 });
matchSchema.index({ seriesId: 1, startTime: 1, isDeleted: 1 });
matchSchema.index({ team1: 1, startTime: -1, isDeleted: 1 });
matchSchema.index({ team2: 1, startTime: -1, isDeleted: 1 });

const matchModel = model("Match", matchSchema);

export default matchModel;
