const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    deleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt_timestamp',
      updatedAt: 'updatedAt_timestamp'
    },
    versionKey: false
  }
);

const CourseModel = mongoose.model('Course', CourseSchema);
module.exports = CourseModel