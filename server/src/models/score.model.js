import { Schema, model } from "mongoose";

const scoreSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    innings: { type: Number, required: true, min: 1 },
    battingTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    score: { type: Number, default: 0, min: 0 },
    wickets: { type: Number, default: 0, min: 0, max: 10 },
    overs: { type: String, default: "0.0", match: /^\d+\.[0-5]$/ },
    runRate: { type: Number, default: 0, min: 0 },
    target: { type: Number, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

scoreSchema.index({ matchId: 1, innings: 1 });

const scoreModel = model("Score", scoreSchema)

export default scoreModel