const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'sunday_first',
      'sunday_second',
      'bible_study',
      'prayer_meeting',
      'ministry_event'
    ]
  },
  ministryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry'
  },
  attendees: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'excused'],
      default: 'absent'
    },
    isFirstTimer: {
      type: Boolean,
      default: false
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
attendanceSchema.index({ date: 1, serviceType: 1, ministryId: 1 });
attendanceSchema.index({ 'attendees.memberId': 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
