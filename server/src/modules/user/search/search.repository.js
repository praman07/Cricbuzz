import playerModel from "../../../models/player.model.js";
import TeamModel from "../../../models/team.model.js";
import { SeriesModel } from "../../../models/series.model.js";

/**
 * Repository Layer — Search (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Parallel regex search across Player, Team, Series.
 * Max 10 results per entity — response lean rakho.
 * escapeRegex() se sanitised input aata hai — ReDoS safe.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Players, teams, series mein parallel search karo.
 * @param {RegExp} regex - Sanitised search regex
 * @returns {Promise<[object[], object[], object[]]>}
 *   [players, teams, series]
 */
export const searchAll = (regex) =>
  Promise.all([
    playerModel
      .find({ name: regex, isDeleted: false })
      .select("name role country image")
      .limit(10)
      .lean(),

    TeamModel
      .find({
        $or: [{ name: regex }, { shortName: regex }],
        isDeleted: false,
      })
      .select("name shortName logo primaryColor")
      .limit(10)
      .lean(),

    SeriesModel
      .find({
        $or: [{ name: regex }, { shortName: regex }],
        isDeleted: false,
      })
      .select("name shortName season status logo")
      .limit(10)
      .lean(),
  ]);