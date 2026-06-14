import * as seriesRepository from "./series.repository.js";
import { ensureId } from "../shared/query.js";
import NotFoundError from "../../../shared/errors/NotFound.error.js";

/**
 * Service Layer — Series (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Public series endpoints ke liye business logic.
 * Points table on-the-fly derive hoti hai — koi separate collection nahi.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Saari active series fetch karo.
 * @returns {Promise<object[]>}
 */
export const getSeries = () => seriesRepository.findAll();

/**
 * Series details + matches + points table ek saath.
 * @param {string} seriesId
 * @returns {Promise<{ series, matches, pointsTable }>}
 * @throws {NotFoundError}
 */
export const getSeriesDetails = async (seriesId) => {
  ensureId(seriesId, "Series");

  const [series, matches] = await Promise.all([
    seriesRepository.findById(seriesId),
    seriesRepository.findMatchesBySeriesId(seriesId),
  ]);

  if (!series) throw new NotFoundError("Series not found");

  const pointsTable = await derivePointsTable(seriesId);

  return { series, matches, pointsTable };
};

/**
 * Series ke matches fetch karo.
 * @param {string} seriesId
 * @returns {Promise<object[]>}
 * @throws {NotFoundError}
 */
export const getSeriesMatches = async (seriesId) => {
  ensureId(seriesId, "Series");

  const series = await seriesRepository.findById(seriesId);

  if (!series) throw new NotFoundError("Series not found");

  return seriesRepository.findMatchesBySeriesId(seriesId);
};

/**
 * Points table derive karo completed matches se.
 * On-the-fly calculate hoti hai — no separate collection.
 * Algorithm:
 *   - Har COMPLETED match ke liye dono teams ka played increment karo
 *   - Winner ko won + 2 points, loser ko lost
 *   - Points desc, phir won desc sort karo
 *
 * @param {string} seriesId
 * @returns {Promise<object[]>}
 */
export const getPointsTable = async (seriesId) => {
  ensureId(seriesId, "Series");

  const series = await seriesRepository.findById(seriesId);

  if (!series) throw new NotFoundError("Series not found");

  return derivePointsTable(seriesId);
};

/**
 * Internal helper — points table derive karo.
 * @param {string} seriesId
 * @returns {Promise<object[]>}
 */
const derivePointsTable = async (seriesId) => {
  const completedMatches =
    await seriesRepository.findCompletedMatchesBySeriesId(seriesId);

  // Map keyed by team ObjectId string
  const teamMap = new Map();

  for (const match of completedMatches) {
    const teams = [match.team1, match.team2];

    for (const team of teams) {
      const key = team._id.toString();

      if (!teamMap.has(key)) {
        teamMap.set(key, {
          team: { _id: team._id, name: team.name, shortName: team.shortName, logo: team.logo },
          played: 0,
          won: 0,
          lost: 0,
          points: 0,
        });
      }

      teamMap.get(key).played += 1;
    }

    // Winner ko points do
    if (match.winner) {
      const winnerKey = match.winner._id.toString();
      const loserKey = teams
        .find((t) => t._id.toString() !== winnerKey)
        ?._id.toString();

      if (teamMap.has(winnerKey)) {
        teamMap.get(winnerKey).won += 1;
        teamMap.get(winnerKey).points += 2;
      }

      if (loserKey && teamMap.has(loserKey)) {
        teamMap.get(loserKey).lost += 1;
      }
    }
  }

  // Points desc, phir won desc sort karo
  return Array.from(teamMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.won - a.won;
  });
};