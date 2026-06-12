import createApp from "./app.js"
import logger from "./config/logger.js";
import env from "./config/env.js"
import { connectDB } from "./database/mongodb.js";

const app = createApp()

function startServer() {
  connectDB().then(() => {
    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, "Server is running");
    })
  }).catch((err) => {
    logger.error({ error: err }, "Error while running server.")
  })

}

startServer()