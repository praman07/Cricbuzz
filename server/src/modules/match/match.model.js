import { Schema, model } from "mongoose";


// ─── Match Schema ──────────────────────────────────────────────────────────
// Represents a cricket match between two teams.
// Each match stores which teams are playing, the venue, the format,
// the scheduled start time, and its current lifecycle status.
//
// NOTE: We use a soft-delete pattern (isDeleted flag) so that
// historical match data is never permanently lost from the database.
// ────────────────────────────────────────────────────────────────────────────

const matchSchema = new Schema(
  {
    // Name of the first team (e.g. "India", "Australia")
    teamA: {
      type: String,
      required: [true, "Team A name is required"],
      trim: true,
    },

    // Name of the second team
    teamB: {
      type: String,
      required: [true, "Team B name is required"],
      trim: true,
    },

    // Current lifecycle state of the match
    // Transitions: SCHEDULED → LIVE → COMPLETED  (or ABANDONED at any point)
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "COMPLETED", "ABANDONED"],
      default: "SCHEDULED",
    },

    // Ground / stadium where the match is being played
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },

    // Cricket format — affects overs, playing conditions, etc.
    format: {
      type: String,
      enum: ["T20", "ODI", "TEST"],
      required: [true, "Match format is required"],
    },

    // When the match is scheduled to begin (UTC)
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    // Soft-delete flag — filtered out in repository queries
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);


// ─── Export ────────────────────────────────────────────────────────────────
const matchModel = model("Match", matchSchema);

export default matchModel;
