import { z } from "zod";

/**
 * Shared Zod Primitives
 * ─────────────────────────────────────────────────────────────────────
 * Reusable Zod schemas imported by every module-level validator.
 * Centralising here ensures consistent error messages and prevents
 * the same regex being re-derived (differently) across 8+ modules.
 * ───────────────────────────────────────────────────────────────────── 
 */

/**
 * Validates a MongoDB ObjectId string (24-char hex).
 * Used as a building block inside module validators:
 *   import { objectId } from "../../shared/validators/common.js";
 *   params: z.object({ id: objectId })
 */
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

/**
 * Pre-built param schema for routes with a single :id param.
 * Use directly when no other param/body/query validation is needed:
 *   validateRequest(idParamSchema)
 */
export const idParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});