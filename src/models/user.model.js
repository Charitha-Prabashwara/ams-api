const mongoose = require('mongoose');
const { userTypes } = require('../config');
const userSchema = new mongoose.Schema(
  {
    registration_id: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    department: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
    name: {
      first_name: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      last_name: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      full_name: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      with_initial_name: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      line1: {
        type: String,
        trim: true,
        required: true,
      },
      line2: {
        type: String,
        trim: true,
      },
      zip: {
        type: String,
        trim: true,
        required: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
    last_login: {
      type: Date,
    },
    enable_state: {
      type: Boolean,
      default: true,
    },
    deleted:{
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: userTypes.USER_TYPES,
      default: userTypes.USER_USER,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt_timestamp',
      updatedAt: 'updatedAt_timestamp',
    },
    versionKey: false,
  },
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
