const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');

// Mark attendance
router.post('/mark', authenticate, attendanceController.markAttendance);

// Get attendance for a specific date and service
router.get('/', authenticate, attendanceController.getAttendance);

// Get attendance analytics
router.get('/analytics', authenticate, attendanceController.getAnalytics);

// Bulk mark attendance (for offline sync)
router.post('/sync', authenticate, attendanceController.syncAttendance);

module.exports = router;
