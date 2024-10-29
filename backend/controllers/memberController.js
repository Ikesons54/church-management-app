const Member = require('../models/Member');
const catchAsync = require('../utils/catchAsync');

exports.getAllMembers = catchAsync(async (req, res) => {
  const members = await Member.find()
    .populate('user', 'firstName lastName email profileImage')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: members.length,
    data: members
  });
});

exports.getMember = catchAsync(async (req, res) => {
  const member = await Member.findById(req.params.id)
    .populate('user')
    .populate('attendance')
    .populate('contributions');

  if (!member) {
    return res.status(404).json({
      status: 'error',
      message: 'Member not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: member
  });
});

exports.createMember = catchAsync(async (req, res) => {
  const newMember = await Member.create({
    ...req.body,
    membershipId: generateMembershipId()
  });

  res.status(201).json({
    status: 'success',
    data: newMember
  });
});

exports.updateMember = catchAsync(async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!member) {
    return res.status(404).json({
      status: 'error',
      message: 'Member not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: member
  });
});

exports.deleteMember = catchAsync(async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);

  if (!member) {
    return res.status(404).json({
      status: 'error',
      message: 'Member not found'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMemberStats = catchAsync(async (req, res) => {
  const stats = await Member.aggregate([
    {
      $group: {
        _id: null,
        totalMembers: { $sum: 1 },
        activeMembers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        inactiveMembers: {
          $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
        }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: stats[0]
  });
});

exports.getNextMemberId = async (req, res) => {
  try {
    // Find the highest existing member ID
    const lastMember = await Member.findOne({}, { memberId: 1 })
      .sort({ memberId: -1 })
      .limit(1);

    let nextNumber = 1;
    if (lastMember && lastMember.memberId) {
      // Extract the number from the last ID (COPAD0001 -> 1)
      const lastNumber = parseInt(lastMember.memberId.replace('COPAD', ''));
      nextNumber = lastNumber + 1;
    }

    res.json({ nextNumber });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error generating member ID'
    });
  }
}; 