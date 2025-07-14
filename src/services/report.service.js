const httpStatus = require('http-status');
const { Report } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a report
 * @param {Object} reportBody
 * @returns {Promise<Report>}
 */
const createReport = async (reportBody, userId) => {
  return Report.create({ ...reportBody, user: userId });
};

/**
 * Query for reports
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReports = async (filter, options) => {
  const reports = await Report.paginate(filter, options);
  return reports;
};

/**
 * Get report by id
 * @param {ObjectId} id
 * @returns {Promise<Report>}
 */
const getReportById = async (id) => {
  return Report.findById(id);
};

// /**
//  * Get report by email
//  * @param {string} email
//  * @returns {Promise<Report>}
//  */
// const getUserByEmail = async (email) => {
//   return User.findOne({ email });
// };

/**
 * Update report by report
 * @param {ObjectId} reportId
 * @param {Object} updateBody
 * @returns {Promise<Report>}
 */
const updateReportById = async (reportId, updateBody) => {
  const report = await getReportrById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
//   if (updateBody.email && (await Report.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
  Object.assign(report, updateBody);
  await report.save();
  return report;
};

/**
 * Delete report by id
 * @param {ObjectId} reportId
 * @returns {Promise<Report>}
 */
const deleteReportById = async (reportId) => {
  const report = await getReportById(ReportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  await report.remove();
  return report;
};

module.exports = {
  createReport,
  queryReports,
  getReportById,
  // getReportByEmail,
  updateReportById,
  deleteReportById,
};
