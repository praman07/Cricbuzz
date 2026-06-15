import { StatusCodes } from "http-status-codes";

/**
 * Shared Response Helpers — Public API
 * ─────────────────────────────────────────────────────────────────────
 * Factory functions that standardise JSON response shape across all
 * public controllers. Every public endpoint uses one of these instead
 * of calling res.status().json() directly — keeps response envelope
 * consistent and reduces boilerplate.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Send a successful response with a single data object.
 * @param {object} res - Express response object
 * @param {object} data - Data to send
 * @param {number} [status=200] - HTTP status code
 */
export const sendSuccess = (res, data, status = StatusCodes.OK) => {
  return res.status(status).json({
    success: true,
    data,
  });
};

/**
 * Send a successful response with an array of items.
 * Automatically includes a count field.
 * @param {object} res - Express response object
 * @param {Array} items - Array of items to send
 * @param {number} [status=200] - HTTP status code
 */
export const sendList = (res, items, status = StatusCodes.OK) => {
  return res.status(status).json({
    success: true,
    count: items.length,
    data: items,
  });
};

/**
 * Send a paginated response.
 * @param {object} res - Express response object
 * @param {Array} items - Array of items for current page
 * @param {object} pagination - { page, limit, total }
 */
export const sendPaginated = (res, items, pagination) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    count: items.length,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
    data: items,
  });
};