const TourModel = require('./../models/TourModel');
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
  console.log(tour);
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
