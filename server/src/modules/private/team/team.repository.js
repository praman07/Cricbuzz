import Team from "./team.model.js"

/**
 * Create a new team document.
 * @param {Object} data - Team fields (name, shortName, logo, etc.)
 */
const create = (data) => {
  return Team.create(data)
}

/**
 * Get all active (non-deleted) teams.
 */
const findAll = () => {
  return Team.find({ isDeleted: false })
}

/**
 * Get a single active team by its ID.
 */
const findById = (id) => {
  return Team.findOne({ _id: id, isDeleted: false })
}

/**
 * Find an active team by name OR shortName.
 * Used for uniqueness checks during create/update.
 * NOTE: does not exclude any ID — on update, caller must
 * verify the matched doc isn't the same record being updated.
 */
const findByNameOrShortName = (name, shortName) => {
  return Team.findOne({
    isDeleted: false,
    $or: [{ name }, { shortName }],
  })
}

/**
 * Update an active team by ID. Returns the updated document.
 */
const updateById = (id, data) => {
  return Team.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true }
  )
}

/**
 * Soft-delete a team by setting isDeleted = true.
 * Does not remove the document from the database.
 */
const softDelete = (id) => {
  return Team.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  )
}

/**
 * Add a player to the team's squad.
 * Uses $addToSet to avoid duplicate entries (idempotent).
 */
const addPlayer = (teamId, playerId) => {
  return Team.findOneAndUpdate(
    { _id: teamId, isDeleted: false },
    { $addToSet: { squadPlayers: playerId } },
    { new: true }
  )
}

/**
 * Remove a player from the team's squad.
 * Uses $pull to remove the matching ObjectId.
 */
const removePlayer = (teamId, playerId) => {
  return Team.findOneAndUpdate(
    { _id: teamId, isDeleted: false },
    { $pull: { squadPlayers: playerId } },
    { new: true }
  )
}

/**
 * Check whether an active team exists with this ID.
 * Used by other modules (e.g. match creation) for existence guards.
 */
const exists = (id) => {
  return Team.exists({ _id: id, isDeleted: false })
}

export default {
  create,
  findAll,
  findById,
  findByNameOrShortName,
  updateById,
  softDelete,
  addPlayer,
  removePlayer,
  exists,
}