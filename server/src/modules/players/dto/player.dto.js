// ─── Player DTOs (Data Transfer Objects) ─────────────────────────────────
// DTOs keep the service layer focused on clean data instead of raw request payloads.
// ────────────────────────────────────────────────────────────────────────────

export const createPlayerDto = (payload) => ({
  name: payload.name,
  image: payload.image,
  role: payload.role,
  country: payload.country,
  battingStyle: payload.battingStyle,
  bowlingStyle: payload.bowlingStyle,
});

export const updatePlayerDto = (payload) => {
  const dto = {};

  if (payload.name) dto.name = payload.name;
  if (payload.image) dto.image = payload.image;
  if (payload.role) dto.role = payload.role;
  if (payload.country) dto.country = payload.country;
  if (payload.battingStyle) dto.battingStyle = payload.battingStyle;
  if (payload.bowlingStyle) dto.bowlingStyle = payload.bowlingStyle;

  return dto;
};
