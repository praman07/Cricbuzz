import express from "express";
import morgan from "morgan";
import Errorhandler from "./shared/middlewares/errorHandler.middleware.js";
import env from "./config/env.js";
import securityMiddleware from "./shared/middlewares/security.middleware.js";
import authRouter from './modules/auth/auth.routes.js'
import googleOAuthMiddleware from "./shared/middlewares/googleOAuth.middleware.js";
import userRoutes from './modules/users/user.routes.js'
import matchRoutes from './modules/match/match.route.js'
// import teamRoutes from './modules/team/team.route.js'
export default function createApp() {
  const app = express();

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }


  securityMiddleware(app)
  googleOAuthMiddleware(app)
  //---match route--->>
  app.use('/api/match', matchRoutes)
  app.use('/api/auth', authRouter)
  app.use('/api/users', userRoutes)
  // app.use('/api/team', teamRoutes)
  //----health route-->>
  app.get("/health", (req, res) => {
    res.json({
      message: "healthy",
    });
  });



  //----- global error handling middleware ------
  app.use(Errorhandler);

  return app;
}
