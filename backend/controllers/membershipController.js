const Member = require('../models/Member');
const { generateMemberId } = require('../utils/idGenerator');

// Generate unique member ID
exports.generateMemberId = async (req, res) => {
  try {
    const memberId = await generateMemberId();
    res.json({ memberId });
  } catch (error) {
    res.status(500).json({ message: 'Error generating member ID' });
  }
};

// Submit membership application
exports.submitApplication = async (req, res) => {
  try {
    const membershipData = {
      ...req.body,
      status: 'pending',
      applicationDate: new Date()
    };

    const newMember = new Member(membershipData);
    await newMember.save();

    res.status(201).json({ 
      message: 'Application submitted successfully',
      memberId: membershipData.memberId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application' });
  }
};

// Get application status
exports.getApplicationStatus = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findOne({ memberId });
    
    if (!member) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ 
      status: member.status,
      applicationDate: member.applicationDate 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application status' });
  }
};

// Get reports
exports.getReports = async (req, res) => {
  try {
    const { dateRange } = req.body;
    
    // Build date filter if dateRange is provided
    const dateFilter = dateRange ? {
      applicationDate: {
        $gte: new Date(dateRange[0]),
        $lte: new Date(dateRange[1])
      }
    } : {};

    // Get basic statistics
    const totalMembers = await Member.countDocuments(dateFilter);
    const waterBaptizedCount = await Member.countDocuments({
      ...dateFilter,
      waterBaptism: true
    });
    const holyGhostBaptizedCount = await Member.countDocuments({
      ...dateFilter,
      holyGhostBaptism: true
    });

    // Get marital status distribution
    const maritalStatusDistribution = await Member.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$maritalStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get nationality distribution
    const nationalityDistribution = await Member.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$nationality',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get new members this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newMembersThisMonth = await Member.countDocuments({
      applicationDate: { $gte: startOfMonth }
    });

    // Get member details
    const members = await Member.find(dateFilter)
      .select('memberId firstName lastName nationality maritalStatus waterBaptism holyGhostBaptism applicationDate')
      .sort('-applicationDate');

    res.json({
      totalMembers,
      waterBaptizedCount,
      waterBaptizedPercentage: ((waterBaptizedCount / totalMembers) * 100).toFixed(1),
      holyGhostBaptizedCount,
      holyGhostBaptizedPercentage: ((holyGhostBaptizedCount / totalMembers) * 100).toFixed(1),
      newMembersThisMonth,
      maritalStatusDistribution,
      nationalityDistribution,
      members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMemberProfile = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const member = await Member.findOne({ memberId })
      .populate('attendance.event');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 