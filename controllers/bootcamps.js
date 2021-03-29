const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc Get all Bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  let reqQuery = { ...req.query };

  //Exclude fields
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over the query params and remove the fields to be excluded
  removeFields.forEach((params) => delete reqQuery[params]);

  //Create the query string
  let queryStr = JSON.stringify(reqQuery);

  //Create the operators to query within($gte)

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  //Finding the resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //Select Fields to show
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');

    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);

  //Executing the query
  const bootcamps = await query;

  //Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

//@desc Get a Bootcamp
//@route  GET /api/v1/bootcamps/:id
//@access public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Create a Bootcamp
//@route POST/api/v1/bootcamps
//@access public

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Update a Bootcamp
//@route  PUT /api/v1/bootcamps/:id
//@access public

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, mydata: bootcamp });
});

//@desc Delete a Bootcamp
//@route  DELETE /api/v1/bootcamps/:id
//@access public

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

//@desc Get Bootcamps within the radius of where you are located
//@route  GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access public

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //Get lat/long
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  //calculate the radius of the earth
  //Earth radius is 6378

  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.json({ success: true, count: bootcamps.length, data: bootcamps });
});
