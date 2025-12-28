const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
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
      index: true,
      autopopulate:true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
      autopopulate:true
    },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
      autopopulate:true
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

SemesterSchema.plugin(autopopulate);


module.exports = mongoose.model('Semester', SemesterSchema);
