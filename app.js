const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const appError = require('./utils/AppError');
const globalErrorHandler = require('./contorollers/errorControlleres');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION💥 Shutting down!');
});

dotenv.config({ path: './config.env' });
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
const AppError = require('./utils/AppError');
const errorControlleres = require('./contorollers/errorControlleres');
console.log('enter app.js');

const app = express();

// console.log(`---${process.env.NODE_ENV}---`);

if ((process.env.NODE_ENV || '').trim() === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

app.use((req, res, next) => {
  console.log('enter to *');
  next(
    new AppError(
      `Can't find ${req.originalUrl} on server 😒`,
      404,
    ),
  );
});
app.use(errorControlleres);

module.exports = app;
