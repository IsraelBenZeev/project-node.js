const User = require('../modules/userModule');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  console.log('enter to signup');
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});
