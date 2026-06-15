import * as homeRepository from ".//home.repository.js";

/**
 * Service Layer — Home (Public)
 * ─────────────────────────────────────────────────────────────────────
 * Repository ka Promise.all result destructure karke clean named
 * object return karta hai.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Home feed fetch karo — live, upcoming, recent matches.
 * @returns {Promise<{ liveMatches, upcomingMatches, recentMatches }>}
 */
export const getHomeFeed = async () => {
  const [liveMatches, upcomingMatches, recentMatches] =
    await homeRepository.getHomeMatches();

  return { liveMatches, upcomingMatches, recentMatches };
};