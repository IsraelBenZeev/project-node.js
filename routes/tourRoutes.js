const express = require('express');
const tourControllers = require('../contorollers/tourController');

const router = express.Router();
// router.param('id', tourControllers.checkId);
router.get(
  '/top-5-cheap',
  tourControllers.aliasTopTours,
  tourControllers.getAllTours,
);
router.get('/tour-stats', tourControllers.getTourstat);
router.get('/monthly-plan/:year', tourControllers.getMonthlyPlan);
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.creatTour);
// .post(tourControllers.checkReqBody, tourControllers.creatTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTOur)
  .delete(tourControllers.deleteTour);
module.exports = router;
