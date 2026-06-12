import mongoose from "mongoose"
import env from "../config/env.js"
import logger from "../config/logger.js"


export const connectDB = async () => {
 try {
   await mongoose.connect(env.MONGO_URI)
  logger.info("mongodb connected.")
 } catch (error) {
 logger.error("Error in mongodb")
 }
}

