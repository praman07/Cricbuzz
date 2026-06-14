import TeamModel from "../../../models/team.model.js";

/**
 * Repository Layer — Team (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Read-only queries. Admin TeamModel reuse hota hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Saari active teams fetch karo with populated squad.
 * @returns {Promise<object[]>}
 */
export const findAll = () =>
  TeamModel.find({ isDeleted: false })
    .populate("squadPlayers", "name role country image")
    .sort({ name: 1 })
    .lean();

/**
 * Single team by ID with populated squad.
 * @param {string} teamId
 * @returns {Promise<object|null>}
 */
export const findById = (teamId) =>
  TeamModel.findOne({ _id: teamId, isDeleted: false })
    .populate("squadPlayers", "name role country image battingStyle bowlingStyle")
    .lean();