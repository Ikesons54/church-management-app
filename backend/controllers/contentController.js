const Content = require('../models/Content');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');

exports.createContent = catchAsync(async (req, res) => {
  const { type, title, description, tags } = req.body;
  let mediaUrl = '';

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: type === 'podcast' ? 'video' : 'image',
      folder: type === 'podcast' ? 'podcasts' : 'blog'
    });
    mediaUrl = result.secure_url;
  }

  const newContent = await Content.create({
    type,
    title,
    description,
    mediaUrl,
    tags,
    author: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: newContent
  });
});

exports.getAllContent = catchAsync(async (req, res) => {
  const { type, tag, search } = req.query;

  const query = {};
  if (type) query.type = type;
  if (tag) query.tags = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const content = await Content.find(query)
    .populate('author', 'firstName lastName')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: content.length,
    data: content
  });
});

exports.updateContent = catchAsync(async (req, res) => {
  const content = await Content.findOneAndUpdate(
    {
      _id: req.params.id,
      author: req.user.id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!content) {
    return res.status(404).json({
      status: 'error',
      message: 'Content not found or unauthorized'
    });
  }

  res.status(200).json({
    status: 'success',
    data: content
  });
}); 