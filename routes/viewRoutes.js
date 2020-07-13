const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
