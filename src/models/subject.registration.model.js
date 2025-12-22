const mongoose = require('mongoose');

const subjectRegistrationSchema = new mongoose.Schema(
  {
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    semester:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
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

const SubjectRegistrationModel = mongoose.model('SubjectRegistration', subjectRegistrationSchema);

module.exports = SubjectRegistrationModel;
