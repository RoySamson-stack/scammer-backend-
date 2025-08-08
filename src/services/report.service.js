const httpStatus = require('http-status');
const { Report } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a report
 * @param {Object} reportBody
 * @param {ObjectId} userId - ID of the user creating the report
 * @returns {Promise<Report>}
 */
const createReport = async (reportBody, userId) => {
  return Report.create({ ...reportBody, reporterId: userId });
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
 * Get reports by user ID (reports created by the user)
 * @param {ObjectId} userId - User ID to get reports for
 * @param {Object} options - Query and filter options
 * @param {string} [options.type] - Filter by report type
 * @param {string} [options.status] - Filter by report status
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getUserReports = async (userId, options = {}) => {
  // Build filter object
  const filter = { reporterId: userId }; // Match reports created by this user
  
  // Add optional filters
  if (options.type) filter.type = options.type;
  if (options.status) filter.status = options.status;
  
  console.log('=== DEBUG getUserReports ===');
  console.log('userId (authenticated user ID):', userId);
  console.log('filter:', filter);
  
  // Build clean options object for pagination
  const cleanOptions = {};
  if (options.sortBy) cleanOptions.sortBy = options.sortBy;
  if (options.limit) cleanOptions.limit = options.limit;
  if (options.page) cleanOptions.page = options.page;
  
  const reports = await Report.paginate(filter, cleanOptions);
  
  console.log('Found reports count:', reports.results?.length || 0);
  if (reports.results?.length > 0) {
    console.log('Sample report reporterId field:', reports.results[0].reporterId);
  }
  console.log('========================');
  
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

/**
 * Get report by id and verify ownership
 * @param {ObjectId} reportId
 * @param {ObjectId} userId - ID of the user requesting the report
 * @returns {Promise<Report>}
 */
const getReportByIdAndUser = async (reportId, userId) => {
  const report = await Report.findOne({ _id: reportId, reporterId: userId });
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found or access denied');
  }
  return report;
};

/**
 * Update report by report ID (with ownership verification)
 * @param {ObjectId} reportId
 * @param {ObjectId} userId - ID of the user updating the report
 * @param {Object} updateBody
 * @returns {Promise<Report>}
 */
const updateReportById = async (reportId, userId, updateBody) => {
  const report = await getReportByIdAndUser(reportId, userId);
  
  Object.assign(report, updateBody);
  await report.save();
  return report;
};

/**
 * Delete report by id (with ownership verification)
 * @param {ObjectId} reportId
 * @param {ObjectId} userId - ID of the user deleting the report
 * @returns {Promise<Report>}
 */
const deleteReportById = async (reportId, userId) => {
  const report = await getReportByIdAndUser(reportId, userId);
  await report.remove();
  return report;
};

module.exports = {
  createReport,
  queryReports,
  getUserReports,
  getReportById,
  getReportByIdAndUser,
  updateReportById,
  deleteReportById,
};