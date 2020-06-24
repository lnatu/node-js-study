const AppError = require('./../utils/AppError');
const UserModel = require('./../models/UserModel');
const catchError = require('./../utils/catchError');
const multer = require('multer');
const factory = require('./factoryController');

const upload = multer({ dest: 'public/img/users' });

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchError(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // 1. Create error if user post password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Cannot update password here'));
  }

  // 2. Update user doc
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchError(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This route is not yet define'
  });
};

exports.getAllUsers = factory.getAll(UserModel);
exports.getUser = factory.getOne(UserModel);
exports.updateUser = factory.updateOne(UserModel);
exports.deleteUser = factory.deleteOne(UserModel);
