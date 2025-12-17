const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
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

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
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


SemesterSchema.index(
  { department: 1, course: 1, batch: 1, code: 1 },
  { unique: true }
);

module.exports = mongoose.model('Semester', SemesterSchema);
