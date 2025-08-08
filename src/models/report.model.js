const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const reportSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed', 'pending'],
      default: 'open',
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'investment_scam',
        'phishing',
        'romance_scam',
        'lottery_scam',
        'scam_token',
        'fake_aridrop',
        'other',
      ],
    },
    scammerName: {
      type: String,
      trim: true,
      default: '',
    },
    scammerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    scammerEmail: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
      default: '',
    },
    amountLost: {
      type: Number,
      min: 0,
      default: 0,
    },
    evidence: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reportSchema.plugin(toJSON);
reportSchema.plugin(paginate);

// Static method to find reports by user
reportSchema.statics.findByReporter = async function (userId, options = {}) {
  return this.paginate({ userId }, options);
};

// Static method to get report statistics for a user
reportSchema.statics.getReporterStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    open: 0,
    'in-progress': 0,
    closed: 0,
    pending: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;