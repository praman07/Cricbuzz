import { SeriesModel } from "../../../models/series.model.js";
import MatchModel from "../../../models/match.model.js";
import { MATCH_STATUS } from "../../../shared/constants/matchStatus.js";

/**
 * Repository Layer — Series (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Read-only queries for public series endpoints.
 * Admin SeriesModel reuse hota hai — koi data duplication nahi.
 * ─────────────────────────────────────────────────────────────────────
 */

const TEAM_POPULATE = { path: "team1 team2", select: "name shortName logo" };
const WINNER_POPULATE = { path: "winner", select: "name shortName logo" };

/**
 * Saari active series fetch karo.
 * @returns {Promise<object[]>}
 */
export const findAll = () =>
  SeriesModel.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();

/**
 * Single series by ID.
 * @param {string} seriesId
 * @returns {Promise<object|null>}
 */
export const findById = (seriesId) =>
  SeriesModel.findOne({ _id: seriesId, isDeleted: false }).lean();

/**
 * Series ke saare matches fetch karo.
 * @param {string} seriesId
 * @returns {Promise<object[]>}
 */
export const findMatchesBySeriesId = (seriesId) =>
  MatchModel.find({ seriesId, isDeleted: false })
    .populate(TEAM_POPULATE)
    .populate(WINNER_POPULATE)
    .sort({ startTime: 1 })
    .lean();

/**
 * Points table ke liye sirf COMPLETED matches fetch karo.
 * @param {string} seriesId
 * @returns {Promise<object[]>}
 */
export const findCompletedMatchesBySeriesId = (seriesId) =>
  MatchModel.find({
    seriesId,
    status: MATCH_STATUS.COMPLETED,
    isDeleted: false,
  })
    .populate(TEAM_POPULATE)
    .populate(WINNER_POPULATE)
    .lean();