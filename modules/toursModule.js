const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

console.log('enter modul tour');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have less or equal 40 characters',
      ],
      minLength: [
        10,
        'A tour name must have more or equal 10 characters',
      ],
      // validate: [
      //   validator.isAlpha,
      //   'Tour name must only contain characters',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message:
          'Difficulty is either: easy, medium, difficulty',
      },
    },

    ratingAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Rating must be below 5.0'],
      min: [1, 'Rating must be above 1.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createDate: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { versionKey: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function (next) {
//   console.log('Wiil save document....');
//   console.log('2');

//   next();
// });
// tourSchema.pre('save', function (next) {
//   console.log('2');
//   console.log(this);
//   next();
// });
tourSchema.pre(/^find/, function (next) {
  console.log('enter to find middlewere pre of tours');

  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log('enter to find middlewere post of tours');
  // console.log(docs);
  console.log(
    `query took: ${Date.now() - this.start} miliseconds`,
  );
  next();
});
//AGGREGATION MIDDELEWARE
tourSchema.pre('aggregate', function (next) {
  console.log('enter to aggregate middlewere of tours');
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
  // console.log(JSON.stringify(this.pipeline(), null ,2));
});

tourSchema.index({ name: 1 }, { unique: true });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;