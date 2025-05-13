const express = require('express');
const userController = require('../contorollers/usersController');
const authontroller = require('../contorollers/authController');

const router = express.Router();

router.route('/signup').post(authontroller.signUp);
router.route('/login').post(authontroller.login);

router
  .route('/forgotPassword')
  .post(authontroller.forgotPassword);
router
  .route('/resetPassword')
  .post(authontroller.resetPassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
