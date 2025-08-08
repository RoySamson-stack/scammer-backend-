const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReport = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().required().valid(
      'investment_scam',
      'phishing',
      'romance_scam',
      'lottery_scam',
      'scam_token',
      'fake_aridrop',
      'other'
    ),
    status: Joi.string().valid('open', 'in-progress', 'closed', 'pending').default('open'),
    location: Joi.string().allow('', null),
    view_count: Joi.number().integer().min(0).default(0),
    scammer_name: Joi.string().allow('', null),
    scammer_phone: Joi.string().allow('', null),
    upvotes: Joi.number().integer().min(0).default(0),
    downvotes: Joi.number().integer().min(0).default(0),
    is_trending: Joi.boolean().default(false),
  }),
};

const getReports = {
  query: Joi.object().keys({
    user_id: Joi.number(),
    type: Joi.string(),
    status: Joi.string(),
    scammer_name: Joi.string(),
    location: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId),
  }),
};

const getUserReports = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    type: Joi.string().valid(
      'investment_scam',
      'phishing',
      'romance_scam',
      'lottery_scam',
      'scam_token',
      'fake_aridrop',
      'other'
    ),
    status: Joi.string().valid('open', 'in-progress', 'closed', 'pending'),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).default(1),
  }),
};

const updateReport = {
  params: Joi.object().keys({
    reportId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      user_id: Joi.number(),
      title: Joi.string(),
      description: Joi.string(),
      type: Joi.string().valid(
        'investment_scam',
        'phishing',
        'romance_scam',
        'lottery_scam',
        'scam_token',
        'fake_aridrop',
        'other',
      ),
      status: Joi.string().valid('open', 'in-progress', 'closed', 'pending'),
      scammer_name: Joi.string().allow('', null),
      scammer_phone: Joi.string().allow('', null),
      scammer_website: Joi.string().uri().allow('', null),
      location: Joi.string().allow('', null),
      view_count: Joi.number().integer().min(0),
      upvotes: Joi.number().integer().min(0),
      downvotes: Joi.number().integer().min(0),
      is_trending: Joi.boolean(),
    })
    .min(1),
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReport,
  getReports,
  getReport,
  getUserReports,
  updateReport,
  deleteReport,
};