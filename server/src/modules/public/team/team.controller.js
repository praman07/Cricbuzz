import teamService from "./team.service.js"
import asyncHandler from "../../../shared/middleware/asyncHandler.js"
import { NotFoundError } from "../../../shared/errors/index.js"
import { objectId } from "../../../shared/validators/common.js"

/**
 * GET /api/teams
 * Public: list all teams.
 */
const getTeams = asyncHandler(async (req, res) => {
  const teams = await teamService.getTeams()
  res.status(200).json({ success: true, data: teams })
})

/**
 * GET /api/teams/:id
 * Public: get team details with squad populated.
 */
const getTeamById = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!objectId.safeParse(id).success) {
    throw new NotFoundError("Team not found")
  }

  const team = await teamService.getTeamById(id)

  if (!team) {
    throw new NotFoundError("Team not found")
  }

  res.status(200).json({ success: true, data: team })
})

export default {
  getTeams,
  getTeamById,
}