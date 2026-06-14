import TeamModel from "../models/team.model.js";

/**
 * Repository Layer — Team
 * -----------------------------------------------------------------------
 * Pure Mongoose data-access functions. No business logic, no HTTP
 * knowledge, no error throwing beyond what Mongoose itself throws.
 * Every query filters isDeleted: false to enforce the soft-delete pattern.
 * -----------------------------------------------------------------------
 */

/**
 * Create a new team document.
 * @param {object} data - Team fields (name, shortName, logo, primaryColor, createdBy)
 * @returns {Promise<object>} created team document
 */
export const create = (data) => TeamModel.create(data);

/**
 * Find all active (non-deleted) teams.
 * @returns {Promise<object[]>} array of team documents
 */
export const findAll = () =>
  TeamModel.find({ isDeleted: false }).populate("squadPlayers", "name role country");

/**
 * Find a single active team by its ID.
 * @param {string} id - Team ObjectId
 * @returns {Promise<object|null>} team document or null if not found/deleted
 */
export const findById = (id) =>
  TeamModel.findOne({ _id: id, isDeleted: false }).populate(
    "squadPlayers",
    "name role country"
  );

/**
 * Find a team by name OR shortName (used for uniqueness checks on create/update).
 * Excludes a given id (useful when updating, to ignore the document being updated).
 * @param {string} name
 * @param {string} shortName
 * @param {string} [excludeId] - ObjectId to exclude from the match
 * @returns {Promise<object|null>}
 */
export const findByNameOrShortName = (name, shortName, excludeId) => {
  const query = {
    isDeleted: false,
    $or: [{ name }, { shortName }],
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return TeamModel.findOne(query);
};

/**
 * Update a team by ID and return the updated document.
 * @param {string} id - Team ObjectId
 * @param {object} data - Fields to update
 * @returns {Promise<object|null>} updated team document or null if not found
 */
export const updateById = (id, data) =>
  TeamModel.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
    new: true,
    runValidators: true,
  });

/**
 * Soft-delete a team by ID (sets isDeleted: true).
 * @param {string} id - Team ObjectId
 * @param {string} updatedBy - User ObjectId performing the deletion
 * @returns {Promise<object|null>} updated (soft-deleted) team document or null
 */
export const softDeleteById = (id, updatedBy) =>
  TeamModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, updatedBy },
    { new: true }
  );

/**
 * Add a player to a team's squad (idempotent — uses $addToSet).
 * @param {string} teamId - Team ObjectId
 * @param {string} playerId - Player ObjectId to add
 * @returns {Promise<object|null>} updated team document or null
 */
export const addPlayer = (teamId, playerId) =>
  TeamModel.findOneAndUpdate(
    { _id: teamId, isDeleted: false },
    { $addToSet: { squadPlayers: playerId } },
    { new: true }
  ).populate("squadPlayers", "name role country");

/**
 * Remove a player from a team's squad.
 * @param {string} teamId - Team ObjectId
 * @param {string} playerId - Player ObjectId to remove
 * @returns {Promise<object|null>} updated team document or null
 */
export const removePlayer = (teamId, playerId) =>
  TeamModel.findOneAndUpdate(
    { _id: teamId, isDeleted: false },
    { $pull: { squadPlayers: playerId } },
    { new: true }
  ).populate("squadPlayers", "name role country");

/**
 * Check whether a team document exists and is active.
 * @param {string} id - Team ObjectId
 * @returns {Promise<boolean>}
 */
export const exists = async (id) => {
  const team = await TeamModel.exists({ _id: id, isDeleted: false });
  return Boolean(team);
};