const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    academic: {
      lb: {
        type: Number,
        required: true,
      },
      ub: {
        type: Number,
        required: true,
      },
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

const BatchModel = mongoose.model('Batch', batchSchema);
module.exports = BatchModel;
