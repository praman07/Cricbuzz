import express from "express";
import morgan from "morgan";
import Errorhandler from "./shared/middlewares/errorHandler.middleware.js";
import env from "./config/env.js";
import securityMiddleware from "./shared/middlewares/security.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import googleOAuthMiddleware from "./shared/middlewares/googleOAuth.middleware.js";
import userRoutes from "./modules/users/user.routes.js";
import playerRouter from "./modules/players/players.routes.js";
import seriesRoutes from "./modules/series/series.route.js";
import matchRoutes from "./modules/match/match.route.js";
import teamRoutes from "./modules/team/team.route.js";

// ─── Public Routes (user/) ────────────────────────────────────────────
import homePublicRouter from "./modules/user/home/home.route.js";
import matchPublicRouter from "./modules/user/match/match.route.js";
import seriesPublicRouter from "./modules/user/series/series.route.js";
import teamPublicRouter from "./modules/user/team/team.route.js";
import playerPublicRouter from "./modules/user/player/player.route.js";
import searchPublicRouter from "./modules/user/search/search.route.js";
import commentaryPublicRouter from "./modules/user/commentary/commentary.route.js";

export default function createApp() {
  const app = express();

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  securityMiddleware(app);
  googleOAuthMiddleware(app);

  // ─── Public Routes (no auth, cached) ────────────────────────────────
  // NOTE: Public routes PEHLE mount karo —
  // Express first-match-wins: public GETs cached handlers se serve honge,
  // admin POST/PATCH/DELETE fall-through karenge admin routers tak.
  app.use("/api/home", homePublicRouter);
  app.use("/api/matches", matchPublicRouter);
  app.use("/api/matches/:matchId/commentary", commentaryPublicRouter);
  app.use("/api/series", seriesPublicRouter);
  app.use("/api/teams", teamPublicRouter);
  app.use("/api/players", playerPublicRouter);
  app.use("/api/search", searchPublicRouter);

  // ─── Admin Routes ────────────────────────────────────────────────────
  app.use("/api/match", matchRoutes);
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRoutes);
  app.use("/api/series", seriesRoutes);
  app.use("/api/team", teamRoutes);
  app.use("/api/players", playerRouter);

  // ─── Health Check ───────────────────────────────────────────────────
  app.get("/health", (req, res) => {
    res.json({ message: "healthy" });
  });

  // ─── Global Error Handler ────────────────────────────────────────────
  app.use(Errorhandler);

  return app;
}