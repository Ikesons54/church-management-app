const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true
  },
  type: {
    type: String,
    enum: ['phone', 'whatsapp', 'email', 'visit'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date
  },
  response: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'no_response']
  },
  notes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  nextFollowUp: {
    type: Date
  }
}, {
  timestamps: true
});

followUpSchema.index({ scheduledDate: 1, status: 1 });
followUpSchema.index({ visitor: 1 });
followUpSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('FollowUp', followUpSchema); 