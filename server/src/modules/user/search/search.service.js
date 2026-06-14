import * as searchRepository from "./search.repository.js";
import { escapeRegex } from "../shared/query.js";
import BadRequestError from "../../../shared/errors/BadRequest.error.js";

/**
 * Service Layer — Search (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Cross-entity regex search — players, teams, series.
 * Min 2 chars enforce karo — single char search too broad hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Players, teams, series mein search karo.
 * @param {string} q - Search query from req.query.q
 * @returns {Promise<{ players, teams, series }>}
 * @throws {BadRequestError} agar query 2 chars se kam hai
 */
export const search = async (q) => {
  if (!q || q.trim().length < 2) {
    throw new BadRequestError("Search query must be at least 2 characters");
  }

  const regex = new RegExp(escapeRegex(q.trim()), "i");

  const [players, teams, series] = await searchRepository.searchAll(regex);

  return { players, teams, series };
};