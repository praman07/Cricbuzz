import mongoose from "mongoose";
import playerRoleConstant from "../shared/constants/playerRole.constant.js";

const playerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: [true, "Name must be unique"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(playerRoleConstant),
      required: [true, "Role is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    battingStyle: { type: String },
    bowlingStyle: { type: String },
    isDeleted: { type: Boolean, default: false },
    // createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    // updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const playerModel = mongoose.model("player", playerSchema);

export default playerModel;
