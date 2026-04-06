const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate');

const lectureSchema = new mongoose.Schema({

    topic:{
        type:String,
        trim:true,
        required:true
    },

    lecturer:{
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        autopopulate:true

    },

    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
        index: true,
        autopopulate:true
    },

    semester:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true,
        index: true,
        autopopulate:true
    },

    scheduledTime:{
        type:Date,
        required:true,
        index:true,
    },

    actualStartTime:{
        type:Date,
        index:true
    },

    endTime:{
        type:Date,
        index:true,
        validate: {
            validator: function(value) {
                return !this.actualStartTime || value > this.actualStartTime;
            },
            message: 'End time must be greater than start time'
        }
        
    },

    state:{
        type:String,
        enum:["scheduled", "completed", "postponed", "canceled", "rescheduled"],
        default:"scheduled"
    },

    deleted:{
        type:Boolean,
        default:false
    }



},
     {
        timestamps: {
          createdAt: 'createdAt_timestamp',
          updatedAt: 'updatedAt_timestamp'
        },
        versionKey: false
      })
lectureSchema.index({ semester: 1, subject: 1, scheduledTime: 1 });
lectureSchema.plugin(autopopulate)
module.exports = mongoose.model("Lecture", lectureSchema)