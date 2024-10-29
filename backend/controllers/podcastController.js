const Podcast = require('../models/Podcast');
const cloudinary = require('../utils/cloudinary'); // You'll need to set up cloudinary

exports.createPodcast = async (req, res) => {
  try {
    const { title, description, speaker, duration, category, tags } = req.body;
    const audioFile = req.files.audio;
    const thumbnail = req.files.thumbnail;

    // Upload audio to cloudinary
    const audioResult = await cloudinary.uploader.upload(audioFile.tempFilePath, {
      resource_type: 'video',
      folder: 'podcasts/audio'
    });

    // Upload thumbnail if provided
    let thumbnailUrl = '';
    if (thumbnail) {
      const thumbnailResult = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
        folder: 'podcasts/thumbnails'
      });
      thumbnailUrl = thumbnailResult.secure_url;
    }

    const podcast = await Podcast.create({
      title,
      description,
      speaker,
      audioUrl: audioResult.secure_url,
      thumbnailUrl,
      duration,
      category,
      tags,
      createdBy: req.user._id
    });

    res.status(201).json(podcast);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .sort({ publishDate: -1 })
      .populate('createdBy', 'firstName lastName');
    res.json(podcasts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
