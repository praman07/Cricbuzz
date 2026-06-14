//
// Series DTO
// Used to control the response structure returned
// to the client and hide unnecessary database fields.
//

export default class SeriesDto {
  /**
   * Convert a single series document
   * into API response format
   */
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

  /**
   * Convert multiple series documents
   * into API response format
   */
  static toResponseList(seriesList) {
    return seriesList.map((series) => this.toResponse(series));
  }
}
