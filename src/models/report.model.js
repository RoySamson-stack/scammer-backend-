const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
  //   reporterId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true,
  // },
  //   // scammerInfo:{
    //     type: String,
    //     required: true,
    // // },
    // amountLost: {
    //     type: Number,
    //     required: true,
    //     min: 0,
    // },
    // evidence: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reportSchema.plugin(toJSON);
reportSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
reportSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
reportSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

reportSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
