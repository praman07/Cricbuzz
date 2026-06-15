import express from "express"
import hpp from "hpp"
import helmet from "helmet"
import compression from "compression"
import cors from "cors"
import ratelimit from "express-rate-limit"
import env from "../../config/env.js"
import cookieParser from 'cookie-parser'

export default function securityMiddleware(app) {
  app.use(helmet(app))
app.use(cookieParser())
  app.use(cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true
  }))

  app.use(ratelimit({
    windowMs: env.RATELIMIT_WINDOWMS,
    limit: env.RATELIMIT,
    message: "too many request try again after few minitues"
  }))
console.log(env.RATELIMIT)
console.log(env.RATELIMIT_WINDOWMS)
  app.use(hpp())
  app.use(helmet())
  app.use(express.json({ limit: "3mb" }))
  app.use(express.urlencoded({ extended: true, limit: "3mb" }))
}