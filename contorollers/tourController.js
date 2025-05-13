const Tour = require('../modules/toursModule');
const APIfeaturs = require('../utils/apiFeaturs');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//   ),
// );
// exports.checkReqBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     console.log('enter to cindition');
//     return res.status(400).json({
//       status: 'error',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.customQueryParams = {
    limit: '5',
    sort: 'ratingAverage,price',
    fields: 'name,price',
  };
  next();
};
exports.getAllTours = catchAsync(async (req, res) => {
  console.log('enter get all tours');
  const myQuery = {
    ...req.query,
    ...req.customQueryParams,
  };
  const featurs = new APIfeaturs(Tour.find(), myQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await featurs.query;
  res.status(200).json({
    status: 'success',
    resoults: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  console.log('enter to get one tour');
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    console.log('enter to if');
    return next(
      new AppError('No   found with that ID', 404),
    );
  }
  res.status(200).json({
    status: 'success',
    time: req.requestTime,
    data: {
      tour,
    },
  });
});

exports.creatTour = catchAsync(async (req, res) => {
  console.log('enter to create tour');
  // const newTour = new Tour();
  // newTour.save()
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTOur = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },  
  );
  if (!tour) {
    return next(
      new AppError('No tour found with that ID', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  
  if (!tour) {
    return next(
      new AppError('No tour found with that ID', 404),
    );
  }
  res.status(204).json({
    status: 'success',
    data: { tour },
  });
});

exports.getTourstat = async (req, res) => {
  console.log('enter tour stat');
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      {
        $sort: { minPrice: 1 },
      },
      // {
      //   $match: {_id:{$ne: 'EASY'}}
      // }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stat: stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: `${err}`,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tour: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numToursStarts: -1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: `${err}`,
    });
  }
};
exports.restriceTo = catchAsync(async (req, res, next)=>{
  
})
