import playerModel from "../../../models/player.model.js";

/**
 * Repository Layer — Player (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Read-only queries. Admin playerModel reuse hota hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Saare active players fetch karo.
 * @returns {Promise<object[]>}
 */
export const findAll = () =>
  playerModel.find({ isDeleted: false })
    .sort({ name: 1 })
    .lean();

/**
 * Single player by ID.
 * @param {string} playerId
 * @returns {Promise<object|null>}
 */
export const findById = (playerId) =>
  playerModel.findOne({ _id: playerId, isDeleted: false }).lean();