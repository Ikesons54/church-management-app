const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');

exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    address,
    birthday,
    nationality,
    baptism
  } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      phone,
      address,
      birthday,
      nationality,
      baptism
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
});

exports.uploadProfileImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'Please upload a file'
    });
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'profiles',
    width: 300,
    crop: 'scale'
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: result.secure_url },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: user
  });
}); 