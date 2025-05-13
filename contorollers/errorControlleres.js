// const { stack } = require('../app');
const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  //מטפל בשגיאות של ID לא נכון
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
// const handleDuplicateFielsDB = err => {
//   console.log('err insid fun:', err);

//   const message = `Duplicate field value: x. please e=try another value!`;
//   // const value = err.s
// };

const handleDuplicateFielsDB = (err) => {
  const value = err.message.match(/email: "(.*?)"/)[1];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const validationErrorDB = (err) => {
  console.log('enter vvv');
  const errors = Object.values(err.errors).map(
    (el) => el.message,
  );
  const message = `Invalid iniput date. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again😒', 401);
const handleExpiredError = () =>
  new AppError(
    'Your token has expired! Please log in again',
    401,
  );
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error 💣', err);
    console.error('enter to else');
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log('enter to error controller');

  console.log('evironment', process.env.NODE_ENV);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError')
      error = handleCastErrorDB(error);

    if (err.code === 11000) {
      console.log('enter to if 11000');
      error = handleDuplicateFielsDB(error);
    }
    if (err.name === 'ValidationError') {
      console.log('enter if of ValidationError');
      error = validationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      console.log('enter to JsonWebTokenError error');
      error = handleJWTError(error);
    }
    if (err.name === 'TokenExpiredError') {
      console.log('enter to TokenExpiredError error');
      error = handleExpiredError(error);
    }

    sendErrorProduction(error, res);
  }
};
