const mongoose = require('mongoose');
const { CHURCH_LEADERSHIP, EVENT_TYPES } = require('../../constants/eventTypes');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['SPECIAL', 'MINISTRY', 'REGULAR']
  },
  subType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  leaders: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: CHURCH_LEADERSHIP.ROLES.map(role => role.value),
      required: true
    }
  }],
  ministry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry'
  },
  recurringSchedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    pattern: {
      days: [{
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }],
      startTime: String,
      endTime: String,
      frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'custom']
      }
    }
  },
  attendees: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    status: {
      type: String,
      enum: ['registered', 'checked-in', 'absent'],
      default: 'registered'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    checkedInAt: Date,
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: Object.keys(EVENT_STATUS),
    default: 'DRAFT'
  },
  notifications: [{
    type: {
      type: String,
      enum: ['reminder', 'update', 'cancellation']
    },
    message: String,
    sentAt: Date,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recipients: [{
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
      },
      status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
      },
      readAt: Date
    }]
  }]
}, {
  timestamps: true
});

// Indexes
eventSchema.index({ type: 1, subType: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'leaders.user': 1 });
eventSchema.index({ 'attendees.member': 1 });

// Methods
eventSchema.methods.canUserManage = function(userId, userRole) {
  // Check if user has permission based on role
  const roleRank = CHURCH_LEADERSHIP.ROLES.find(r => r.value === userRole)?.rank || 999;
  const eventLeader = this.leaders.find(l => l.user.toString() === userId.toString());
  
  if (roleRank === 1) return true; // Pastor has full access
  if (!eventLeader) return false;
  
  const eventLeaderRank = CHURCH_LEADERSHIP.ROLES.find(r => r.value === eventLeader.role)?.rank || 999;
  return roleRank <= eventLeaderRank;
};

eventSchema.methods.getNextOccurrence = function() {
  if (!this.recurringSchedule.enabled) return this.startDate;
  
  const now = new Date();
  const pattern = this.recurringSchedule.pattern;
  
  // Implementation based on your getNextEventOccurrence helper
  // ... (similar to the helper function in constants)
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 