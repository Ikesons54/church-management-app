const Member = require('../models/Member');
const { uploadToS3 } = require('../utils/fileUpload');
const { sendWelcomeEmail } = require('../utils/emailService');
const { generateQRCode } = require('../utils/qrCodeGenerator');

// Create new member
exports.createMember = async (req, res) => {
  try {
    const memberData = req.body;
    
    // Generate membership ID
    memberData.membershipId = await Member.generateMembershipId();

    // Handle photo upload if exists
    if (req.files?.photo) {
      const photoUrl = await uploadToS3(req.files.photo, 'member-photos');
      memberData.personalInfo.photo = photoUrl;
    }

    const member = new Member(memberData);
    await member.save();

    // Generate QR code for member
    const qrCode = await generateQRCode(member.membershipId);
    
    // Send welcome email
    if (member.personalInfo.email) {
      await sendWelcomeEmail(member);
    }

    res.status(201).json({
      success: true,
      data: member,
      qrCode
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all members with filtering
exports.getMembers = async (req, res) => {
  try {
    const {
      status,
      department,
      role,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    // Build query based on filters
    if (status) query['churchInfo.membershipStatus'] = status;
    if (department) query['churchInfo.department'] = department;
    if (role) query['churchInfo.role'] = role;
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': new RegExp(search, 'i') },
        { 'personalInfo.lastName': new RegExp(search, 'i') },
        { membershipId: new RegExp(search, 'i') },
        { 'personalInfo.email': new RegExp(search, 'i') }
      ];
    }

    const members = await Member.find(query)
      .populate('churchInfo.department')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Member.countDocuments(query);

    res.json({
      success: true,
      data: members,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get pastoral dashboard
exports.getPastoralDashboard = async (req, res) => {
  try {
    const pastorId = req.params.id;
    const pastor = await Member.findById(pastorId);

    if (!pastor || !pastor.isPastor()) {
      return res.status(404).json({
        success: false,
        message: 'Pastor not found'
      });
    }

    const stats = await pastor.getPastoralStats();
    
    // Get upcoming activities
    const upcomingActivities = await Member.aggregate([
      { $match: { _id: pastor._id } },
      { $unwind: '$pastoralActivities' },
      { $match: { 
        'pastoralActivities.date': { $gte: new Date() },
        'pastoralActivities.status': 'scheduled'
      }},
      { $sort: { 'pastoralActivities.date': 1 } },
      { $limit: 5 }
    ]);

    // Get recent sermons
    const recentSermons = pastor.sermons
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        stats,
        upcomingActivities,
        recentSermons,
        pastoralInfo: pastor.churchInfo.pastoralInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add pastoral activity
exports.addPastoralActivity = async (req, res) => {
  try {
    const pastorId = req.params.id;
    const activityData = req.body;

    const pastor = await Member.findById(pastorId);
    if (!pastor || !pastor.isPastor()) {
      return res.status(404).json({
        success: false,
        message: 'Pastor not found'
      });
    }

    pastor.pastoralActivities.push(activityData);
    await pastor.save();

    res.json({
      success: true,
      data: pastor.pastoralActivities[pastor.pastoralActivities.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add sermon
exports.addSermon = async (req, res) => {
  try {
    const pastorId = req.params.id;
    const sermonData = req.body;

    // Handle file uploads if any
    if (req.files) {
      if (req.files.audio) {
        sermonData.audioUrl = await uploadToS3(req.files.audio, 'sermons/audio');
      }
      if (req.files.video) {
        sermonData.videoUrl = await uploadToS3(req.files.video, 'sermons/video');
      }
      if (req.files.document) {
        sermonData.documentUrl = await uploadToS3(req.files.document, 'sermons/documents');
      }
    }

    const pastor = await Member.findById(pastorId);
    if (!pastor || !pastor.isPastor()) {
      return res.status(404).json({
        success: false,
        message: 'Pastor not found'
      });
    }

    pastor.sermons.push(sermonData);
    await pastor.save();

    res.json({
      success: true,
      data: pastor.sermons[pastor.sermons.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle photo upload if exists
    if (req.files?.photo) {
      const photoUrl = await uploadToS3(req.files.photo, 'member-photos');
      updates.personalInfo = {
        ...updates.personalInfo,
        photo: photoUrl
      };
    }

    const member = await Member.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('churchInfo.department');

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
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Archive member instead of hard delete
    member.churchInfo.membershipStatus = 'inactive';
    await member.save();

    res.json({
      success: true,
      message: 'Member archived successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single member
exports.getMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id)
      .populate('churchInfo.department')
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

// Update member attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { memberId, eventId } = req.params;
    const { status } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const attendanceRecord = {
      event: eventId,
      date: new Date(),
      status
    };

    member.attendance.push(attendanceRecord);
    await member.save();

    res.json({
      success: true,
      data: attendanceRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get member statistics
exports.getMemberStats = async (req, res) => {
  try {
    const stats = await Member.aggregate([
      {
        $group: {
          _id: '$churchInfo.membershipStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const departmentStats = await Member.aggregate([
      {
        $unwind: '$churchInfo.department'
      },
      {
        $group: {
          _id: '$churchInfo.department',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        departmentStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ... more controller methods to follow ...