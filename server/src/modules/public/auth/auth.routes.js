import express from "express";
import passport from "passport";
import AuthController from "./auth.controller.js";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
let router = express.Router();
let authController = new AuthController();
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.GoogleCallback.bind(authController),
);

router.post('/register',authController.registerController.bind(authController))
router.post('/login',authController.logincontroller.bind(authController))

router.get("/health", (req, res) => {
  res.json({
    health: "Good",
  });
});

export default router;
