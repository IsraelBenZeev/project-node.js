const User = require('../modules/userModule');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  console.log('enter to signup');
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log(
    'process.env.JWT_EXPIRES_IN: ',
    process.env.JWT_EXPIRES_IN,
  );

  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  console.log('enter to login');

  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(
        'Please provide email end password',
        400,
      ),
    );
  }

  const user = await User.findOne({ email: email }).select(
    '+password',
  );
  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(
      new AppError('Incoreect email or password', 404),
    );
  }
  console.log('user: ', user);

  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log('token: ', token);
  if (!token) {
    next(
      new AppError(
        'You are not logged in, please log in to get access',
        401,
      ),
    );
  }

  next();
});
