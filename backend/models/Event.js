const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['Service', 'Meeting', 'Workshop', 'Social', 'Other']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  location: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendees: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled']
    }
  }],
  recurring: {
    isRecurring: Boolean,
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Yearly']
    },
    endDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 