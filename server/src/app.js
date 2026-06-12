import express from "express";
import morgan from "morgan";
import Errorhandler from "./shared/middlewares/errorHandler.middleware.js";
import env from "./config/env.js";
import securityMiddleware from "./shared/middlewares/security.middleware.js";

export default function createApp() {
  const app = express();

  if (env.NODE_ENV=== "development") {
    app.use(morgan("dev"));
  }

  
  securityMiddleware(app)

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
