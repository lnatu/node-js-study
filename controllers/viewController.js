const Booking = require('./../models/BookingModel');
const UserModel = require('./../models/UserModel');
const TourModel = require('./../models/TourModel');
const AppError = require('./../utils/AppError');
const catchError = require('./../utils/catchError');

exports.getOverview = catchError(async (req, res, next) => {
  // 1. Get tour data
  const tours = await TourModel.find();

  // 2. Build template
  // 3. Render template
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchError(async (req, res, next) => {
  // 1. Get data
  const tour = await TourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2. Build template
  // 3. Render
  res.status(200).render('tour', {
    title: `${tour.name.toUpperCase()} Tour`,
    tour
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchError(async (req, res, next) => {
  // 1. Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2. Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await TourModel.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My tours',
    tours
  });
});

exports.updateUserData = catchError(async (req, res) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
