import matchModel from "./match.model.js";


// ─── Match Repository ──────────────────────────────────────────────────────
// The repository is the ONLY layer that talks directly to MongoDB.
// Every method automatically filters out soft-deleted documents
// (isDeleted: true) so the rest of the app never sees them.
//
// This follows the Repository Pattern — the service layer calls
// repository methods and never imports Mongoose models directly.
// ────────────────────────────────────────────────────────────────────────────

export default class MatchRepo {

  /**
   * Insert a new match document into the database.
   * @param {Object} payload - Validated match data from the DTO
   * @returns {Promise<Object>} The newly created match document
   */
  async create(payload) {
    return await matchModel.create(payload);
  }

  /**
   * Retrieve all matches that haven't been soft-deleted.
   * Accepts an optional query object for filtering (status, format, etc.)
   * @param {Object} query - Additional filter criteria
   * @returns {Promise<Array>} List of match documents (plain JS objects)
   */
  async findAll(query = {}) {
    return await matchModel
      .find({ isDeleted: false, ...query })
      .sort({ startDate: -1 })  // newest matches first
      .lean();
  }

  /**
   * Find a single match by its MongoDB _id.
   * Returns null if the match doesn't exist or has been soft-deleted.
   * @param {string} id - MongoDB ObjectId
   * @returns {Promise<Object|null>} Match document or null
   */
  async findById(id) {
    return await matchModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
  }

  /**
   * Update a match's fields.
   * Uses findOneAndUpdate with { new: true } so we get the updated doc back.
   * @param {string} id - MongoDB ObjectId
   * @param {Object} payload - Fields to update
   * @returns {Promise<Object|null>} Updated match document
   */
  async update(id, payload) {
    return await matchModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        payload,
        { new: true }
      )
      .lean();
  }

  /**
   * Soft-delete a match by flipping its isDeleted flag to true.
   * The document stays in the DB for audit / history purposes.
   * @param {string} id - MongoDB ObjectId
   * @returns {Promise<Object|null>} The soft-deleted match document
   */
  async delete(id) {
    return await matchModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      )
      .lean();
  }
}
