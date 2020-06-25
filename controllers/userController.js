const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./../utils/AppError');
const UserModel = require('./../models/UserModel');
const catchError = require('./../utils/catchError');
const factory = require('./factoryController');

// const multerStorage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename(req, file, cb) {
//     // user-id-currentTimeStamp.jpeg
//     const extension = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchError(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.fileName = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.fileName}`);

  next();
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchError(async (req, res, next) => {
  // 1. Create error if user post password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Cannot update password here'));
  }

  // 2. Update user doc
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.fileName;
  }
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
