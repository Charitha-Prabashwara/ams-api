const mongoose = require('mongoose');

const lecturerSubjectRegistrationSchema = new mongoose.Schema(
  {
    lecturer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
        index: true
    },
    isActive:{
        type: Boolean,
        default:true,
        index:true

    },
    deleted:{
        type: Boolean,
        default:false,
        index:true
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt_timestamp',
      updatedAt: 'updatedAt_timestamp',
    },
    versionKey: false,
  },
);

const LecturerSubjectRegistrationModel = mongoose.model('LecturerSubjectRegistration', lecturerSubjectRegistrationSchema);

module.exports = LecturerSubjectRegistrationModel;
