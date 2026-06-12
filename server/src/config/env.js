import dotenv from "dotenv";
dotenv.config();
import z from "zod";
import logger from "./logger.js";
import appConstant from "../shared/constants/app.constant.js";

const envSchema = z.object({
  PORT: z.coerce.number().default(appConstant.PORT),
  MONGO_URI: z.string().default(appConstant.MONGO_URI),
  NODE_ENV: z.string().default(appConstant.NODE_ENV),
  CORS_ORIGIN: z.string(),
  RATELIMIT_WINDOWMS: z.coerce.number().default(appConstant.RATELIMIT_WINDOWMS),
  RATELIMIT: z.coerce.number().default(appConstant.RATELIMIT),

  // JWT
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
logger.info("check your env's")
}

export default parsed.data;
