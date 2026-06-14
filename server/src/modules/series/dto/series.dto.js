export default class SeriesDto {
  static toResponse(series) {
    return {
      id: series._id,
      name: series.name,
      shortName: series.shortName,
      season: series.season,
      status: series.status,
      logo: series.logo,
      createdBy: series.createdBy,
      updatedBy: series.updatedBy,
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
    };
  }

  static toResponseList(seriesList) {
    return seriesList.map((series) => SeriesDto.toResponse(series));
  }
}
