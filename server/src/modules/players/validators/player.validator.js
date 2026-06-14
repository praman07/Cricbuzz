import { z } from "zod";
import playerRoleConstant from "../../../shared/constants/playerRole.constant.js";

const playerRoleEnum = Object.values(playerRoleConstant);

export const createPlayerValidator = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Player name is required" })
      .min(1, "Player name cannot be empty"),
    image: z
      .string({ required_error: "Image is required" })
      .min(1, "Image cannot be empty"),
    role: z.enum(playerRoleEnum, {
      required_error: "Role is required",
      invalid_type_error: "Invalid role",
    }),
    country: z
      .string({ required_error: "Country is required" })
      .min(1, "Country cannot be empty"),
    battingStyle: z.string().min(1, "Batting style cannot be empty").optional(),
    bowlingStyle: z.string().min(1, "Bowling style cannot be empty").optional(),
  }),
});

export const updatePlayerValidator = z.object({
  body: z.object({
    name: z.string().min(1, "Player name cannot be empty").optional(),
    image: z.string().min(1, "Image cannot be empty").optional(),
    role: z
      .enum(playerRoleEnum, { invalid_type_error: "Invalid role" })
      .optional(),
    country: z.string().min(1, "Country cannot be empty").optional(),
    battingStyle: z.string().min(1, "Batting style cannot be empty").optional(),
    bowlingStyle: z.string().min(1, "Bowling style cannot be empty").optional(),
  }),
});
