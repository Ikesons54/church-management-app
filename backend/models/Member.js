const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  membershipId: {
    type: String,
    unique: true
  },
  dateJoined: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: String,
  dateOfBirth: Date,
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed']
  },
  familyMembers: [{
    name: String,
    relationship: String,
    phone: String
  }],
  ministry: [{
    type: String
  }],
  attendance: [{
    date: Date,
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  }],
  contributions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Finance'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema); 