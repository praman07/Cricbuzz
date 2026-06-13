import { z } from "zod";
import { objectId } from "../../../shared/validators/common.js";

/**
 * Validators — Team
 * -----------------------------------------------------------------------
 * Zod schemas for every write endpoint (body) and param-bearing route
 * (params). Used by validateRequest middleware via .safeParse({ body,
 * params, query }). Shared primitives (objectId) come from
 * shared/validators/common.js to avoid duplicating regex/rules per module.
 * -----------------------------------------------------------------------
 */

/** Create team — POST /api/teams */
export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    shortName: z.string().trim().min(1, "Short name is required").max(10),
    logo: z.string().trim().url("Logo must be a valid URL"),
    primaryColor: z
      .string()
      .trim()
      .regex(/^#[0-9a-fA-F]{6}$/, "primaryColor must be a hex code, e.g. #1A2B3C")
      .optional(),
  }),
});

/** Update team — PATCH /api/teams/:id */
export const updateTeamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      shortName: z.string().trim().min(1).max(10).optional(),
      logo: z.string().trim().url().optional(),
      primaryColor: z
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/, "primaryColor must be a hex code, e.g. #1A2B3C")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

/** Get/Delete team by id — GET|DELETE /api/teams/:id */
export const teamIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/** Add player to squad — POST /api/teams/:teamId/squad */
export const addPlayerToSquadSchema = z.object({
  params: z.object({
    teamId: objectId,
  }),
  body: z.object({
    playerId: objectId,
  }),
});

/** Remove player from squad — DELETE /api/teams/:teamId/squad/:playerId */
export const removePlayerFromSquadSchema = z.object({
  params: z.object({
    teamId: objectId,
    playerId: objectId,
  }),
});

/** Get squad — GET /api/teams/:teamId/squad */
export const getSquadSchema = z.object({
  params: z.object({
    teamId: objectId,
  }),
});