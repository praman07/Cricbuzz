import teamRepository from "../../private/team/team.repository"

/**
 * Public read-only: list all active teams.
 */
const getTeams = () => {
  return teamRepository.findAll()
}

/**
 * Public read-only: get a team by ID, with squad players populated.
 */
const getTeamById = (id) => {
  return teamRepository.findById(id).populate(
    "squadPlayers",
    "name image role country battingStyle bowlingStyle"
  )
}

export default {
  getTeams,
  getTeamById,
}