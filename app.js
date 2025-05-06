const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
console.log('enter app.js');

const app = express();
console.log('test');


// console.log(`---${process.env.NODE_ENV}---`);

if ((process.env.NODE_ENV || '').trim() === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
