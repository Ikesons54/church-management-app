const PrayerRequest = require('../models/PrayerRequest');
const catchAsync = require('../utils/catchAsync');
const socket = require('../utils/socket');

exports.createPrayerRequest = catchAsync(async (req, res) => {
  const newPrayerRequest = await PrayerRequest.create({
    ...req.body,
    requester: req.user.id
  });

  // Emit socket event for real-time updates
  socket.emit('newPrayerRequest', {
    prayerRequest: newPrayerRequest
  });

  res.status(201).json({
    status: 'success',
    data: newPrayerRequest
  });
});

exports.getAllPrayerRequests = catchAsync(async (req, res) => {
  const prayerRequests = await PrayerRequest.find({
    $or: [
      { isPrivate: false },
      { requester: req.user.id },
      { 'prayedBy.user': req.user.id }
    ]
  })
    .populate('requester', 'firstName lastName')
    .populate('prayedBy.user', 'firstName lastName')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: prayerRequests.length,
    data: prayerRequests
  });
});

exports.updatePrayerRequest = catchAsync(async (req, res) => {
  const prayerRequest = await PrayerRequest.findOneAndUpdate(
    {
      _id: req.params.id,
      requester: req.user.id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!prayerRequest) {
    return res.status(404).json({
      status: 'error',
      message: 'Prayer request not found or unauthorized'
    });
  }

  res.status(200).json({
    status: 'success',
    data: prayerRequest
  });
});

exports.markAsPrayed = catchAsync(async (req, res) => {
  const prayerRequest = await PrayerRequest.findById(req.params.id);

  if (!prayerRequest) {
    return res.status(404).json({
      status: 'error',
      message: 'Prayer request not found'
    });
  }

  // Add user to prayedBy array if not already there
  if (!prayerRequest.prayedBy.some(p => p.user.toString() === req.user.id)) {
    prayerRequest.prayedBy.push({
      user: req.user.id,
      date: Date.now()
    });
    await prayerRequest.save();
  }

  res.status(200).json({
    status: 'success',
    data: prayerRequest
  });
});

exports.addComment = catchAsync(async (req, res) => {
  const prayerRequest = await PrayerRequest.findById(req.params.id);

  if (!prayerRequest) {
    return res.status(404).json({
      status: 'error',
      message: 'Prayer request not found'
    });
  }

  prayerRequest.comments.push({
    user: req.user.id,
    text: req.body.text
  });

  await prayerRequest.save();

  // Emit socket event for real-time updates
  socket.emit('newPrayerComment', {
    prayerRequestId: prayerRequest._id,
    comment: prayerRequest.comments[prayerRequest.comments.length - 1]
  });

  res.status(200).json({
    status: 'success',
    data: prayerRequest
  });
}); 