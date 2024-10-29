const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Tithe', 'Offering', 'Donation', 'Expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Check', 'Card', 'Bank Transfer', 'Online']
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed'
  },
  receiptNumber: String,
  attachments: [{
    type: String // URLs to stored documents
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Finance', financeSchema); 