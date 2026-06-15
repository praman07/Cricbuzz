/**
 * Response Cache Middleware
 * ─────────────────────────────────────────────────────────────────────
 * In-memory TTL cache for public GET routes.
 *
 * How it works:
 *   1. GET request aata hai — Map mein URL check karo
 *      Hit  → cached response return karo (MongoDB touch nahi hota)
 *      Miss → next() call karo, phir res.json() intercept karke store karo
 *
 * Limitations:
 *   - Per-process only — multiple instances mein cache share nahi hota
 *   - No manual invalidation — sirf TTL expiry
 *   - Horizontal scaling ke liye Redis chahiye
 *
 * Usage:
 *   import { responseCache } from "../cache/responseCache.js";
 *   router.get("/", responseCache(60), asyncHandler(controller.getTeams));
 * ─────────────────────────────────────────────────────────────────────
 */

/** @type {Map<string, { status: number, body: any, expiresAt: number }>} */
const cache = new Map();

/**
 * responseCache middleware factory.
 * @param {number} ttlSeconds - Kitne seconds tak cache rakho
 * @returns {import("express").RequestHandler}
 */
export const responseCache = (ttlSeconds) => (req, res, next) => {
  // Sirf GET requests cache karo
  if (req.method !== "GET") return next();

  const key = req.originalUrl;
  const cached = cache.get(key);

  // Cache hit — expired nahi hai toh return karo
  if (cached && Date.now() < cached.expiresAt) {
    return res.status(cached.status).json(cached.body);
  }

  // Cache miss — res.json() intercept karo
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    // Sirf 2xx responses cache karo
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, {
        status: res.statusCode,
        body,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
    }

    return originalJson(body);
  };

  next();
};