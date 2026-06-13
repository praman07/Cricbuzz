import express from "express";
import morgan from "morgan";
import Errorhandler from "./shared/middlewares/errorHandler.middleware.js";
import env from "./config/env.js";
import securityMiddleware from "./shared/middlewares/security.middleware.js";
import authRouter from './modules/public/auth/auth.routes.js'
import googleOAuthMiddleware from "./shared/middlewares/googleOAuth.middleware.js";
import userRoutes from './modules/private/users/user.routes.js'
export default function createApp() {
  const app = express();

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }


  securityMiddleware(app)
  googleOAuthMiddleware(app)
  app.use('/api/auth', authRouter)
  app.use('/api/users', userRoutes)
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
