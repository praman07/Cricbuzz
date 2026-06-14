import express from "express";
import passport from "passport";
import AuthController from "./auth.controller.js";

let router = express.Router();
let authController = new AuthController();

/**
 * @route   GET /auth/google
 * @desc    Initiate Google OAuth Login
 * @access  Public
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth Callback URL
 * @access  Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.GoogleCallback.bind(authController),
);

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  authController.registerController.bind(authController)
);

/**
 * @route   POST /auth/login
 * @desc    Login existing user
 * @access  Public
 */
router.post(
  "/login",
  authController.logincontroller.bind(authController)
);

/**
 * @route   GET /auth/health
 * @desc    Health Check Endpoint
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.json({
    health: "Good",
  });
});

export default router;