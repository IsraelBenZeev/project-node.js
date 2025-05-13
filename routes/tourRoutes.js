const express = require('express');
const tourControllers = require('../contorollers/tourController');
const authController = require('../contorollers/authController');

const router = express.Router();
// router.param('id', tourControllers.checkId);
router.get(
  '/top-5-cheap',
  tourControllers.aliasTopTours,
  tourControllers.getAllTours,
);
router.get('/tour-stats', tourControllers.getTourstat);
router.get(
  '/monthly-plan/:year',
  tourControllers.getMonthlyPlan,
);
router
  .route('/')
  .get(authController.protect, tourControllers.getAllTours)
  .post(tourControllers.creatTour);
// .post(tourControllers.checkReqBody, tourControllers.creatTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTOur)
  .delete(
    authController.protect,
    authController.restriceTo('admin'),
    tourControllers.deleteTour,
  );
module.exports = router;
