import hpp from "hpp"
import helmet from "helmet"
import compression from "compression"
import ratelimit from "express-rate-limit"
import env from "../../config/env.js"

export default function securityMiddleware(app) {
  app.use(helmet(app))

  app.use(cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    Credential: true
  }))

  app.use(ratelimit({
    windowMs: env.RATELIMIT_WINDOWMS,
    limit: env.RATELIMIT,
    message: "too many request try again after few minitues"
  }))

  app.use(hpp())
  app.use(helmet())
  app.use(express.json({ limit: "3mb" }))
  app.use(express.urlencoded({ extended: true, limit: "3mb" }))
}