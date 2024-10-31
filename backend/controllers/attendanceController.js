const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const { calculateAttendanceStats } = require('../utils/attendanceUtils');
const moment = require('moment');

exports.markAttendance = async (req, res) => {
  try {
    const { memberId, status, date, serviceType, ministryId } = req.body;
    
    // Check if attendance record already exists
    let attendance = await Attendance.findOne({
      date,
      serviceType,
      ministryId,
      'attendees.memberId': memberId
    });

    if (attendance) {
      // Update existing record
      attendance = await Attendance.findOneAndUpdate(
        {
          date,
          serviceType,
          ministryId,
          'attendees.memberId': memberId
        },
        {
          $set: {
            'attendees.$.status': status,
            'attendees.$.updatedAt': new Date()
          }
        },
        { new: true }
      );
    } else {
      // Create new attendance record if none exists for this service
      attendance = await Attendance.findOneAndUpdate(
        { date, serviceType, ministryId },
        {
          $push: {
            attendees: {
              memberId,
              status,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        },
        { upsert: true, new: true }
      );
    }

    // Calculate updated statistics
    const stats = await calculateAttendanceStats(attendance);

    res.json({ success: true, attendance, stats });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking attendance',
      error: error.message 
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { date, serviceType, ministryId } = req.query;
    
    // Find attendance record
    const attendance = await Attendance.findOne({
      date,
      serviceType,
      ministryId
    }).populate('attendees.memberId');

    if (!attendance) {
      // If no attendance record exists, get all members for initial marking
      const members = await Member.find(
        ministryId ? { ministries: ministryId } : {}
      );
      
      const initialAttendance = {
        date,
        serviceType,
        ministryId,
        attendees: members.map(member => ({
          memberId: member._id,
          status: 'absent',
          member: member
        }))
      };

      return res.json({ 
        success: true, 
        attendance: initialAttendance,
        stats: await calculateAttendanceStats(initialAttendance)
      });
    }

    res.json({ 
      success: true, 
      attendance,
      stats: await calculateAttendanceStats(attendance)
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching attendance',
      error: error.message 
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const query = {
      date: {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      }
    };

    if (type !== 'combined') {
      query.type = type;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('attendees.memberId')
      .sort('date');

    const analytics = {
      trends: [],
      demographics: [],
      ministryBreakdown: [],
      growthMetrics: {},
      topMetrics: {}
    };

    // Calculate trends
    let previousAttendance = null;
    analytics.trends = attendanceRecords.map(record => {
      const stats = calculateAttendanceStats(record);
      const growthRate = previousAttendance 
        ? ((stats.present - previousAttendance) / previousAttendance * 100).toFixed(1)
        : 0;
      
      previousAttendance = stats.present;
      
      return {
        date: record.date,
        attendance: stats.present,
        growthRate: parseFloat(growthRate),
        type: record.serviceType,
        newMembers: record.attendees.filter(a => a.isFirstTimer).length
      };
    });

    // Calculate demographics
    const allAttendees = attendanceRecords.flatMap(r => r.attendees)
      .filter(a => a.status === 'present');
    
    const demographicCounts = allAttendees.reduce((acc, attendee) => {
      const member = attendee.memberId;
      acc[member.category] = (acc[member.category] || 0) + 1;
      return acc;
    }, {});

    analytics.demographics = Object.entries(demographicCounts).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / allAttendees.length) * 100).toFixed(1)
    }));

    // Calculate ministry breakdown
    if (type === 'ministry' || type === 'combined') {
      const ministryAttendance = await Attendance.aggregate([
        {
          $match: {
            date: {
              $gte: moment(startDate).startOf('day').toDate(),
              $lte: moment(endDate).endOf('day').toDate()
            },
            ministryId: { $exists: true }
          }
        },
        {
          $group: {
            _id: '$ministryId',
            totalAttendance: { 
              $sum: { 
                $size: {
                  $filter: {
                    input: '$attendees',
                    as: 'attendee',
                    cond: { $eq: ['$$attendee.status', 'present'] }
                  }
                }
              }
            }
          }
        }
      ]);

      analytics.ministryBreakdown = await Promise.all(
        ministryAttendance.map(async ministry => {
          const ministryDoc = await Ministry.findById(ministry._id);
          return {
            ministry: ministryDoc.name,
            attendance: ministry.totalAttendance,
            growthRate: 0 // Calculate growth rate if needed
          };
        })
      );
    }

    // Calculate top metrics
    const allStats = attendanceRecords.map(record => 
      calculateAttendanceStats(record)
    );

    analytics.topMetrics = {
      averageAttendance: Math.round(
        allStats.reduce((acc, stat) => acc + stat.present, 0) / allStats.length
      ),
      growthRate: parseFloat(
        ((allStats[allStats.length - 1].present - allStats[0].present) / 
          allStats[0].present * 100).toFixed(1)
      ),
      newMembers: allAttendees.filter(a => a.isFirstTimer).length,
      retentionRate: parseFloat(
        ((allAttendees.filter(a => a.status === 'present').length / 
          allAttendees.length) * 100).toFixed(1)
      )
    };

    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Error calculating analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error calculating analytics',
      error: error.message 
    });
  }
};
