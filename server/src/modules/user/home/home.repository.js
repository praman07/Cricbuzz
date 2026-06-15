import MatchModel from "../../../models/match.model.js";
import { MATCH_STATUS } from "../../../shared/constants/matchStatus.js";

/**
 * Repository Layer — Home (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Teen parallel Mongoose queries — live, upcoming, recent matches.
 * Promise.all se ek saath chalte hain — DB round trips minimize hote hain.
 * ─────────────────────────────────────────────────────────────────────
 */

const TEAM_POPULATE = { path: "team1 team2", select: "name shortName logo" };
const SERIES_POPULATE = { path: "seriesId", select: "name shortName season" };

/**
 * Home feed ke liye teen match lists fetch karo parallel mein.
 * @returns {Promise<[object[], object[], object[]]>}
 *   [liveMatches, upcomingMatches, recentMatches]
 */
export const getHomeMatches = () =>
  Promise.all([
    // Live matches (LIVE ya INNINGS_BREAK)
    MatchModel.find({
      status: { $in: [MATCH_STATUS.LIVE, MATCH_STATUS.INNINGS_BREAK] },
      isDeleted: false,
    })
      .populate(SERIES_POPULATE)
      .populate(TEAM_POPULATE)
      .sort({ startTime: 1 })
      .limit(10)
      .lean(),

    // Upcoming matches
    MatchModel.find({
      status: MATCH_STATUS.UPCOMING,
      isDeleted: false,
    })
      .populate(SERIES_POPULATE)
      .populate(TEAM_POPULATE)
      .sort({ startTime: 1 })
      .limit(10)
      .lean(),

    // Recently completed matches
    MatchModel.find({
      status: MATCH_STATUS.COMPLETED,
      isDeleted: false,
    })
      .populate(SERIES_POPULATE)
      .populate(TEAM_POPULATE)
      .populate({ path: "winner", select: "name shortName logo" })
      .sort({ startTime: -1 })
      .limit(10)
      .lean(),
  ]);