const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/auth');
const VisitorController = require('../controllers/VisitorController');
const FollowUpController = require('../controllers/FollowUpController');
const ReminderController = require('../controllers/ReminderController');

// Visitor Routes
router.post('/visitors', validateToken, VisitorController.createVisitor);
router.get('/visitors', validateToken, VisitorController.getVisitors);
router.get('/visitors/:id', validateToken, VisitorController.getVisitorById);
router.put('/visitors/:id', validateToken, VisitorController.updateVisitor);
router.delete('/visitors/:id', validateToken, VisitorController.deleteVisitor);

// Follow-up Routes
router.post('/visitors/:id/follow-up', validateToken, FollowUpController.createFollowUp);
router.get('/follow-ups', validateToken, FollowUpController.getFollowUps);
router.put('/follow-ups/:id', validateToken, FollowUpController.updateFollowUp);
router.delete('/follow-ups/:id', validateToken, FollowUpController.deleteFollowUp);

// Analytics Routes
router.get('/analytics/visitors', validateToken, VisitorController.getAnalytics);
router.get('/analytics/follow-ups', validateToken, FollowUpController.getAnalytics);

// Reminder Routes
router.get('/reminders', validateToken, ReminderController.getReminders);
router.post('/reminders', validateToken, ReminderController.createReminder);
router.put('/reminders/:id', validateToken, ReminderController.updateReminder);
router.post('/reminders/:id/complete', validateToken, ReminderController.completeReminder);
router.post('/reminders/:id/snooze', validateToken, ReminderController.snoozeReminder);

module.exports = router; 