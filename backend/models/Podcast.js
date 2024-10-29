const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Podcast title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  speaker: {
    type: String,
    required: [true, 'Speaker name is required']
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required']
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Sermon', 'Bible Study', 'Youth', 'Worship', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String
  }],
  publishDate: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdBy
});

module.exports = mongoose.model('Podcast', podcastSchema);
