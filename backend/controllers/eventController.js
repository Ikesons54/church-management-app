const Event = require('../models/Event');
const { CHURCH_LEADERSHIP } = require('../../constants/eventTypes');

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

exports.createEvent = async (req, res) => {
  try {
    const { user } = req;
    const eventData = req.body;

    // Validate user permission
    const userRole = user.role;
    const permissions = CHURCH_LEADERSHIP.PERMISSIONS[userRole];
    
    if (!permissions.includes('create')) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to create events' 
      });
    }

    // Add creator as leader
    eventData.leaders = [{
      user: user._id,
      role: userRole
    }];

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const updates = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permission
    if (!event.canUserManage(user._id, user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this event'
      });
    }

    Object.assign(event, updates);
    await event.save();

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Only Pastor and Presiding Elder can delete events
    const canDelete = ['pastor', 'presiding_elder'].includes(user.role);
    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete events'
      });
    }

    await event.remove();
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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

exports.listEvents = async (req, res) => {
  try {
    const { 
      type, 
      ministry, 
      startDate, 
      endDate, 
      status,
      search 
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (ministry) query.ministry = ministry;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('leaders.user', 'name role')
      .populate('ministry', 'name')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkInAttendee = async (req, res) => {
  try {
    const { eventId, memberId } = req.params;
    const { user } = req;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find attendee
    const attendee = event.attendees.find(
      a => a.member.toString() === memberId
    );

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Attendee not registered for this event'
      });
    }

    // Update check-in status
    attendee.status = 'checked-in';
    attendee.checkedInAt = new Date();
    attendee.checkedInBy = user._id;

    await event.save();

    res.json({
      success: true,
      message: 'Attendee checked in successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.sendEventNotification = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message, type, recipients } = req.body;
    const { user } = req;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permission
    if (!event.canUserManage(user._id, user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to send notifications'
      });
    }

    // Create notification
    const notification = {
      type,
      message,
      sentAt: new Date(),
      sentBy: user._id,
      recipients: recipients.map(recipient => ({
        member: recipient,
        status: 'sent'
      }))
    };

    event.notifications.push(notification);
    await event.save();

    // TODO: Integrate with your notification service (FCM, SMS, etc.)

    res.json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 