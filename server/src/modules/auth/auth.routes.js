import express from "express";
import passport from "passport";
import AuthController from "./auth.controller.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { authMiddleware, authorizeRoles } from "../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../shared/constants/role.js";

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
  asyncHandler(authController.GoogleCallback.bind(authController)),
);

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  // authMiddleware,
  // authorizeRoles(ROLES.SUPER_ADMIN),
  asyncHandler(authController.registerController.bind(authController))
);

/**
 * @route   POST /auth/login
 * @desc    Login existing user
 * @access  Public
 */
router.post(
  "/login",
  asyncHandler(authController.logincontroller.bind(authController))
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

/**
 * @route   GET /auth/me
 * @desc    Current user 
 * @access  Public
 */

router.get('/me',
  authMiddleware,
  asyncHandler(authController.getMe.bind(authController)))

/**
 * @route   GET /auth/refresh
 * @desc    Generates new Acces Token
 * @access  Public
 */
router.get('/refresh',asyncHandler(authController.refreshAccessToken.bind(authController)))

export default router;