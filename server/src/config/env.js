import dotenv from "dotenv"
dotenv.config()
import z from "zod"
import appConstant from "../shared/constants/app.constant.js"


const envSchema = z.object({
  PORT: z.coerce.number().default(appConstant.PORT),
  MONGO_URI: z.string().default(appConstant.MONGO_URI),
  NODE_ENV: z.string().default(appConstant.NODE_ENV),
  LOGGER_LEVEL: z.string().default(appConstant.LOGGER_LEVEL)
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  logger.info("check your env's");
}

export default parsed.data