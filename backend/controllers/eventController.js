const Event = require('../models/Event');
const catchAsync = require('../utils/catchAsync');

exports.getAllEvents = catchAsync(async (req, res) => {
  const events = await Event.find()
    .populate('organizer', 'firstName lastName')
    .sort('-startDate');

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: events
  });
});

exports.getEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer')
    .populate('attendees.member');

  if (!event) {
    return res.status(404).json({
      status: 'error',
      message: 'Event not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: event
  });
});

exports.createEvent = catchAsync(async (req, res) => {
  const newEvent = await Event.create({
    ...req.body,
    organizer: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: newEvent
  });
});

exports.updateEvent = catchAsync(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!event) {
    return res.status(404).json({
      status: 'error',
      message: 'Event not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: event
  });
});

exports.deleteEvent = catchAsync(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return res.status(404).json({
      status: 'error',
      message: 'Event not found'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.registerForEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      status: 'error',
      message: 'Event not found'
    });
  }

  // Check if member is already registered
  const isRegistered = event.attendees.some(attendee => attendee.member.toString() === req.user.id);

  if (isRegistered) {
    return res.status(400).json({
      status: 'error',
      message: 'Member is already registered for this event'
    });
  }

  // Add member to event attendees
  event.attendees.push({ member: req.user.id });

  // Save the updated event
  await event.save();

  res.status(200).json({
    status: 'success',
    data: event
  });
}); 