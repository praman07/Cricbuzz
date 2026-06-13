import { z } from "zod";


// ─── Match Validators (Zod) ────────────────────────────────────────────────
// We validate the incoming request body using Zod before it ever reaches
// the controller / service layer. This ensures that bad data is rejected
// early with clear, user-friendly error messages.
//
// Two schemas are exported:
//   1. createMatchValidator  — used on POST  /api/matches
//   2. updateMatchValidator  — used on PATCH /api/matches/:id
// ────────────────────────────────────────────────────────────────────────────


/**
 * Validator for creating a new match.
 * All core fields are required: teamA, teamB, venue, format, startDate.
 * Status is optional — defaults to "SCHEDULED" in the model.
 */
export const createMatchValidator = z.object({
  body: z.object({
    teamA: z
      .string({ required_error: "Team A name is required" })
      .min(1, "Team A name cannot be empty"),

    teamB: z
      .string({ required_error: "Team B name is required" })
      .min(1, "Team B name cannot be empty"),

    // Optional at creation — the model defaults to SCHEDULED
    status: z
      .enum(["SCHEDULED", "LIVE", "COMPLETED", "ABANDONED"])
      .optional(),

    venue: z
      .string({ required_error: "Venue is required" })
      .min(1, "Venue cannot be empty"),

    format: z.enum(["T20", "ODI", "TEST"], {
      required_error: "Match format is required (T20 | ODI | TEST)",
    }),

    // ISO-8601 datetime string (e.g. "2026-06-15T14:00:00Z")
    startDate: z
      .string({ required_error: "Start date is required" })
      .datetime("Must be a valid ISO-8601 date-time string"),
  }),
});


/**
 * Validator for updating an existing match.
 * Every field is optional — the client only sends what needs to change.
 */
export const updateMatchValidator = z.object({
  body: z.object({
    teamA: z.string().min(1, "Team A name cannot be empty").optional(),
    teamB: z.string().min(1, "Team B name cannot be empty").optional(),
    status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "ABANDONED"]).optional(),
    venue: z.string().min(1, "Venue cannot be empty").optional(),
    format: z.enum(["T20", "ODI", "TEST"]).optional(),
    startDate: z.string().datetime().optional(),
  }),
});
