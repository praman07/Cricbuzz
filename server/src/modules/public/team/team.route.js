import { Router } from "express"
import teamController from "./team.controller.js"
import responseCache from "../cache/responseCache.js"

const router = Router()


router.get("/", responseCache(60), teamController.getTeams)
router.get("/:id", responseCache(60), teamController.getTeamById)

export default router