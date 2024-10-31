const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['follow_up', 'birthday', 'anniversary', 'custom'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'snoozed', 'cancelled'],
    default: 'pending'
  },
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly']
  },
  snoozedUntil: {
    type: Date
  }
}, {
  timestamps: true
});

reminderSchema.index({ date: 1, status: 1 });
reminderSchema.index({ assignedTo: 1 });
reminderSchema.index({ visitor: 1 });

module.exports = mongoose.model('Reminder', reminderSchema); 