# Church Attendance System Documentation

## Overview
The Church Attendance System is a comprehensive solution for tracking and analyzing attendance across church services and ministry events.

### Key Features
- Real-time attendance tracking
- Offline support with automatic sync
- Detailed analytics and reporting
- Ministry-specific tracking
- Export/Import capabilities
- First-time visitor tracking

## Technical Architecture

### Frontend Components
- `AttendanceTracker`: Main component for tracking attendance
- `MinistryAttendanceTracker`: Ministry-specific attendance tracking
- `AttendanceAnalytics`: Analytics and reporting dashboard

### Backend Services
- Attendance API
- Analytics Service
- Export/Import Service
- Sync Service

### Data Flow
1. User marks attendance
2. Data is saved locally if offline
3. Syncs with server when online
4. Analytics are updated in real-time

## Usage Guide

### Marking Attendance 
javascript
// Example usage
const { markAttendance } = useAttendanceData();
await markAttendance({
memberId: 'member-123',
status: 'present',
date: '2024-01-21',
serviceType: 'sunday_first'
});


### Generating Reports
javascript
// Example usage
const { exportToExcel } = useExportService();
await exportToExcel(attendanceData, 'attendance_report');

### Working Offline
The system automatically handles offline scenarios:
1. Data is stored locally
2. Changes are queued for sync
3. Auto-syncs when online

## Best Practices
1. Regular data backups
2. Periodic sync checks
3. Validate imported data
4. Regular analytics review