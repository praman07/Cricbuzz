import { Router } from "express";
import MatchController from "./match.controller.js";
import validateRequest from "../../shared/middlewares/validateRequest.js";
import {
  createMatchValidator,
  updateMatchValidator,
} from "./validators/match.validator.js";


// ─── Match Routes ──────────────────────────────────────────────────────────
// Defines all REST endpoints for the Match module.
//
// Route summary:
//   POST   /            → create a new match
//   GET    /            → list all matches (supports ?status & ?format filters)
//   GET    /:id         → get a single match by ID
//   PATCH  /:id         → partially update a match
//   DELETE /:id         → soft-delete a match
//
// The validateRequest middleware runs the Zod schema BEFORE the controller,
// so invalid payloads never reach the service layer.
// ────────────────────────────────────────────────────────────────────────────

const router = Router();
const matchController = new MatchController();


// ── Create Match ─────────────────────────────────────────────────────────
router.post(
  "/",
  validateRequest(createMatchValidator),
  matchController.createMatch
);

// ── Get All Matches ──────────────────────────────────────────────────────
router.get(
  "/",
  matchController.getAllMatches
);

// ── Get Match By ID ──────────────────────────────────────────────────────
router.get(
  "/:id",
  matchController.getMatchById
);

// ── Update Match ─────────────────────────────────────────────────────────
router.patch(
  "/:id",
  validateRequest(updateMatchValidator),
  matchController.updateMatch
);

// ── Delete Match ─────────────────────────────────────────────────────────
router.delete(
  "/:id",
  matchController.deleteMatch
);


export default router;
