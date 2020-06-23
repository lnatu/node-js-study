const ReviewModel = require('./../models/ReviewModel');
const factory = require('./factoryController');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }

  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  next();
};

exports.getAllReviews = factory.getAll(ReviewModel);
exports.getReview = factory.getOne(ReviewModel);
exports.createReview = factory.createOne(ReviewModel);
exports.updateReview = factory.updateOne(ReviewModel);
exports.deleteReview = factory.deleteOne(ReviewModel);
