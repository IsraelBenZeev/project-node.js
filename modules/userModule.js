const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

// const { isLowercase } = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxLength: [15, 'A name must have less 15 characters'],
    minLength: [1, 'A name must have more 1 characters'],
  },
  email: {
    type: String,
    required: [true, 'Plese provide your mail'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'Please provide valid email',
    ],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [
      8,
      'A password mist have more 8 characters',
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
    required: [true, 'Please confrim yout password'],
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  console.log('enter to find middlewere pre of users');

  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  console.log('this.password: ', this.password);

  this.passwordConfrim = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcryptjs.compare(
    candidatePassword,
    userPassword,
  );
};
userSchema.methods.isChangedPasswordAfter = function (
  JWTTimestamp,
) {
  console.log('enter to fun isChangedPasswordAfter');

  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
