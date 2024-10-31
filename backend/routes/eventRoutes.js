const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.use(auth); // Protect all routes

router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/:id', eventController.getEvent);
router.get('/', eventController.listEvents);
router.post('/:eventId/check-in/:memberId', eventController.checkInAttendee);
router.post('/:eventId/notifications', eventController.sendEventNotification);

module.exports = router; 