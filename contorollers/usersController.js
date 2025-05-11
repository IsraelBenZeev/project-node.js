const User = require('../modules/userModule');
const APIfeaturs = require('../utils/apiFeaturs');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  console.log('enter to get all users');
  const users = await User.find();

  res.status(500).json({
    status: 'success',
    data: {
      users,
    },
    // message: 'This rout is not defined!',
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not defined!',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not defined!',
  });
};
