const express = require('express');
const useraController = require('../contorollers/usersController');

const router = express.Router();

router
  .route('/')
  .get(useraController.getAllUsers)
  .post(useraController.createUser);
router
  .route('/:id')
  .get(useraController.getUser)
  .patch(useraController.updateUser)
  .delete(useraController.deleteUser);
module.exports = router;
