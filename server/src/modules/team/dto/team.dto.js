// ─── Team DTOs (Data Transfer Objects) ─────────────────────────────────────
// DTOs sit between the controller and the service layer.
// Their job is to pick ONLY the fields we actually need from req.body
// and transform them into a clean object the service can work with.
//
// This prevents unknown / malicious fields (e.g. isDeleted, squadPlayers,
// createdBy spoofing) from leaking into our DB and keeps the service layer
// decoupled from the raw HTTP request shape.
//
// NOTE: since validateRequest does not attach req.validated, controllers
// pass raw req.body here. This DTO layer is the ONLY whitelist standing
// between client input and the repository — keep it in sync with
// team.validator.js whenever fields are added/removed.
// ────────────────────────────────────────────────────────────────────────────

/**
 * Build a DTO for creating a new team.
 * Extracts only the fields a client is allowed to set on creation.
 *
 * @param {Object} payload - req.body
 * @returns {Object} Clean team creation object
 */
export const createTeamDto = (payload) => {
  return {
    name: payload.name,
    shortName: payload.shortName,
    logo: payload.logo,
    primaryColor: payload.primaryColor,
  };
};

/**
 * Build a DTO for updating an existing team.
 * Only includes fields that are actually present in the payload,
 * so we don't accidentally overwrite existing values with `undefined`.
 *
 * @param {Object} payload - req.body
 * @returns {Object} Partial team update object
 */
export const updateTeamDto = (payload) => {
  const dto = {};

  if (payload.name !== undefined) dto.name = payload.name;
  if (payload.shortName !== undefined) dto.shortName = payload.shortName;
  if (payload.logo !== undefined) dto.logo = payload.logo;
  if (payload.primaryColor !== undefined) dto.primaryColor = payload.primaryColor;

  return dto;
};