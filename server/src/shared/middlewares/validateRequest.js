// ─── Validate Request Middleware ────────────────────────────────────────────
// Generic middleware that accepts a Zod schema and validates the
// incoming request (body, query, params) against it.
//
// If validation fails, we short-circuit the request with a 400 response
// containing the list of Zod errors — the request never reaches
// the controller.
//
// Usage:
//   import validateRequest from "../../shared/middleware/validateRequest.js";
//   router.post("/", validateRequest(createMatchValidator), controller.create);
// ────────────────────────────────────────────────────────────────────────────

export default function validateRequest(schema) {
  return (req, res, next) => {
    try {
      // Zod will throw a ZodError if any part of the schema fails
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Everything passed — move on to the next middleware / controller
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }
  };
}
