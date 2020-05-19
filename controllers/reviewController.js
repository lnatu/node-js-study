const ReviewModel = require('./../models/ReviewModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchError = require('./../utils/catchError');
// const AppError = require('./../utils/AppError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};

exports.getAllReview = factory.getAll(ReviewModel);
exports.getReview = factory.getOne(ReviewModel);
exports.createReview = factory.createOne(ReviewModel);
exports.updateReview = factory.updateOne(ReviewModel);
exports.deleteReview = factory.deleteOne(ReviewModel);
