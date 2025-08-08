const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');
const { mongoose } = require('../config/config');

const createReport = async (req, res) => {
  try {
    const report = await reportService.createReport(req.body, req.user._id); // or req.user.id
    res.status(201).json(report);
  } catch (error) {
    // handle error
  }
}

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.queryReports(filter, options);
  res.send(result);
});

const getUserReports = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }
  const userId = req.user.id
  const options = pick(req.query, ['type', 'status', 'sortBy', 'limit', 'page']);
  
  const reports = await reportService.getUserReports(userId, options);
  res.json(reports);
});

const getReport = catchAsync(async (req, res) => {
  const report = await reportService.getReportById(req.params.reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  res.send(report);
});

const updateReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReportById(req.params.reportId, req.body);
  res.send(report);
});

const deleteReport = catchAsync(async (req, res) => {
  await reportService.deleteReportById(req.params.reportId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReport,
  getReports,
  getReport,
  getUserReports,
  updateReport,
  deleteReport,
};