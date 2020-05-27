const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/AppError');
const catchError = require('./../utils/catchError');

exports.deleteOne = Model =>
  catchError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No doc found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchError(async (req, res, next) => {
    const doc = await Model.create(req.body);

    return res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchError(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchError(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    // Execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query.explain();

    // Send response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
