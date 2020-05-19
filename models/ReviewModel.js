const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please write some review']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must has a rating']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

const ReviewModel = mongoose.model('review', reviewSchema);

module.exports = ReviewModel;
