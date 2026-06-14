// ─── Async Handler Utility ─────────────────────────────────────────────────
// Wraps any async route handler / controller method so that
// rejected promises are automatically forwarded to Express's
// global error-handling middleware via next(error).
//
// Without this, every async controller would need its own try/catch block,
// which is repetitive and easy to forget.
//
// Usage:
//   import asyncHandler from "../../shared/utils/asyncHandler.js";
//   router.get("/", asyncHandler(async (req, res) => { ... }));
// ────────────────────────────────────────────────────────────────────────────

export default function asyncHandler(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error)
      next(error);
    }
  };
}
