import { Types } from "mongoose";
import NotFoundError from "../../../shared/errors/NotFound.error.js";

/**
 * Shared Query Utilities — Public API
 * ─────────────────────────────────────────────────────────────────────
 * Reusable helpers jo saare public sub-modules use karte hain.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * MongoDB ObjectId validate karo — invalid hai toh 404 throw karo.
 * Mongoose cast errors ko DB tak pahunchne se rokta hai.
 *
 * @param {string} id - Validate karne wala ID string
 * @param {string} [label="Resource"] - Error message mein label
 * @returns {string} original id agar valid hai
 * @throws {NotFoundError} agar 24-char hex nahi hai
 */
export const ensureId = (id, label = "Resource") => {
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundError(`${label} not found`);
  }
  return id;
};

/**
 * Query string se pagination params parse karo with safe defaults.
 * @param {object} query - req.query
 * @param {number} [defaultLimit=10]
 * @returns {{ page: number, limit: number, skip: number }}
 */
export const pagination = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * User input se special regex characters escape karo.
 * Search queries mein ReDoS attacks rokta hai.
 *
 * @param {string} str - req.query.q se raw search string
 * @returns {string} escaped string jo new RegExp() mein safe hai
 */
export const escapeRegex = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");