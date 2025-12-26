const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      long: {
        type: String,
        required: true,
      },
      short: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
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

const DepartmentModel = mongoose.model('Department', departmentSchema);

module.exports = DepartmentModel;
