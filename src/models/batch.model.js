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

    completed:{
      type: Boolean,
      default:false
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
