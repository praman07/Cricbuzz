import express from "express";
import { createPlayerController } from "./players.controller.js";

const playerRouter = express.Router();

playerRouter.post("/", createPlayerController);

export default playerRouter;
