import MatchModel from "../../../models/match.model.js";
import ScoreModel from "../../../models/score.model.js";
import { MATCH_STATUS } from "../../../shared/constants/matchStatus.js";

/**
 * Repository Layer — Match (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Read-only Mongoose queries for public match endpoints.
 * Admin match model reuse hota hai — koi data duplication nahi.
 * ─────────────────────────────────────────────────────────────────────
 */

const TEAM_POPULATE = {
  path: "team1 team2",
  select: "name shortName logo primaryColor squadPlayers",
  populate: {
    path: "squadPlayers",
    select: "name role battingStyle bowlingStyle image",
  },
};
const SERIES_POPULATE = { path: "seriesId", select: "name shortName season" };
const WINNER_POPULATE = { path: "winner tossWinner", select: "name shortName logo" };
const PLAYING_XI_POPULATE = {
  path: "playingXI.team1.player playingXI.team2.player",
  select: "name role battingStyle bowlingStyle image",
};

/**
 * Saare matches fetch karo — optional status filter ke saath.
 * @param {string} [status] - MATCH_STATUS value ya undefined
 * @returns {Promise<object[]>}
 */
export const findAll = (status) => {
  const query = { isDeleted: false };

  if (status) {
    // live filter mein INNINGS_BREAK bhi include karo
    if (status === MATCH_STATUS.LIVE) {
      query.status = { $in: [MATCH_STATUS.LIVE, MATCH_STATUS.INNINGS_BREAK] };
    } else {
      query.status = status;
    }
  }

  return MatchModel.find(query)
    .populate(SERIES_POPULATE)
    .populate(TEAM_POPULATE)
    .populate(WINNER_POPULATE)
    .populate(PLAYING_XI_POPULATE)
    .sort({ startTime: -1 })
    .lean();
};

/**
 * Single match by ID — scores ke saath.
 * @param {string} matchId
 * @returns {Promise<object|null>}
 */
export const findById = (matchId) =>
  MatchModel.findOne({ _id: matchId, isDeleted: false })
    .populate(SERIES_POPULATE)
    .populate(TEAM_POPULATE)
    .populate(WINNER_POPULATE)
    .populate(PLAYING_XI_POPULATE)
    .lean();

/**
 * Match center data — matchInfo + playingXI ek saath.
 * @param {string} matchId
 * @returns {Promise<object|null>}
 */
export const findCenter = (matchId) =>
  MatchModel.findOne({ _id: matchId, isDeleted: false })
    .populate(SERIES_POPULATE)
    .populate(TEAM_POPULATE)
    .populate(WINNER_POPULATE)
    .populate(PLAYING_XI_POPULATE)
    .lean();

/**
 * Match ke saare scores fetch karo (max 2 — innings 1 aur 2).
 * @param {string} matchId
 * @returns {Promise<object[]>}
 */
export const findScoresByMatchId = (matchId) =>
  ScoreModel.find({ matchId })
    .populate({ path: "battingTeam", select: "name shortName logo" })
    .sort({ innings: 1 })
    .lean();