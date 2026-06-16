import scoreModel from "../../models/score.model.js";

/**
 * Repository Layer — Score
 * -----------------------------------------------------------------------
 * Pure Mongoose data-access. No business logic, no HTTP knowledge.
 * -----------------------------------------------------------------------
 */

/**
 * Create a new score document.
 * @param {object} data
 * @returns {Promise<object>}
 */
const withPlayersPopulate = (query) =>
  query
    .populate("battingTeam", "name shortName logo")
    .populate("striker", "name role battingStyle bowlingStyle image")
    .populate("nonStriker", "name role battingStyle bowlingStyle image")
    .populate("currentBowler", "name role battingStyle bowlingStyle image");

export const create = async (data) => {
  const score = await scoreModel.create(data);
  return withPlayersPopulate(scoreModel.findById(score._id));
};

/**
 * Find all scores for a match.
 * @param {string} matchId
 * @returns {Promise<object[]>}
 */
export const findByMatchId = (matchId) =>
  withPlayersPopulate(
    scoreModel
      .find({ matchId })
      .sort({ innings: 1 })
  );

/**
 * Find score by ID.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export const findById = (id) =>
  withPlayersPopulate(scoreModel.findById(id));

/**
 * Find score by matchId and innings number.
 * @param {string} matchId
 * @param {number} innings
 * @returns {Promise<object|null>}
 */
export const findByMatchAndInnings = (matchId, innings) =>
  scoreModel.findOne({ matchId, innings });

/**
 * Update score by ID.
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object|null>}
 */
export const updateById = (id, data) =>
  withPlayersPopulate(
    scoreModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  );