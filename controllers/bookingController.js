const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/TourModel');
const catchError = require('./../utils/catchError');
const AppError = require('./../utils/AppError');

exports.getCheckoutSession = catchError(async (req, res, next) => {
  // 1. Get current booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3. Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});
