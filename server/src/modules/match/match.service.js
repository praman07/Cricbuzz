import MatchRepo from "../../repository/match.repository.js";
import { createMatchDto, updateMatchDto } from "./dto/match.dto.js";


// ─── Match Service ─────────────────────────────────────────────────────────
// The service layer holds all the business logic for match operations.
// It sits between the controller (HTTP) and the repository (database).
//
// Responsibilities:
//   • Validate business rules (e.g. "does this match exist?")
//   • Transform raw payloads via DTOs before passing to the repo
//   • Throw meaningful errors when something goes wrong
//
// The controller should NEVER call the repository directly —
// it always goes through this service.
// ────────────────────────────────────────────────────────────────────────────

export default class MatchService {

  constructor() {
    // Instantiate the repository — single source of DB access
    this.matchRepo = new MatchRepo();
  }


  /**
   * Create a new match.
   * Transforms the raw payload through createMatchDto before saving.
   *
   * @param {Object} payload - Validated request body
   * @returns {Promise<Object>} The newly created match
   */
  async createMatch(payload) {
    const dto = createMatchDto(payload);
    const match = await this.matchRepo.create(dto);
    return match;
  }


  /**
   * Fetch all matches, with optional query-string filters.
   * Supported filters: status, format (passed via req.query).
   *
   * @param {Object} query - Query string parameters from the request
   * @returns {Promise<Array>} Array of match documents
   */
  async getAllMatches(query) {
    const filter = {};

    // Only add filters that the client actually sent
    if (query.status) filter.status = query.status;
    if (query.format) filter.format = query.format;

    const matches = await this.matchRepo.findAll(filter);
    return matches;
  }


  /**
   * Fetch a single match by its ID.
   * Throws an error if the match doesn't exist (or was soft-deleted).
   *
   * @param {string} id - MongoDB ObjectId
   * @returns {Promise<Object>} The match document
   */
  async getMatchById(id) {
    const match = await this.matchRepo.findById(id);

    if (!match) {
      throw new Error("Match not found");
    }

    return match;
  }


  /**
   * Update an existing match.
   * First verifies that the match exists, then applies partial updates
   * through the updateMatchDto.
   *
   * @param {string} id      - MongoDB ObjectId
   * @param {Object} payload - Fields to update
   * @returns {Promise<Object>} The updated match document
   */
  async updateMatch(id, payload) {
    // Make sure the match actually exists before attempting an update
    await this.getMatchById(id);

    const dto = updateMatchDto(payload);
    const updatedMatch = await this.matchRepo.update(id, dto);
    return updatedMatch;
  }


  /**
   * Soft-delete a match.
   * The record stays in the database but is hidden from all queries.
   *
   * @param {string} id - MongoDB ObjectId
   * @returns {Promise<Object>} The soft-deleted match document
   */
  async deleteMatch(id) {
    // Verify the match exists first
    await this.getMatchById(id);

    const deletedMatch = await this.matchRepo.delete(id);
    return deletedMatch;
  }
}
