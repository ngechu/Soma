const path = require("path");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc Get all Bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
//@access private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Update a Bootcamp
//@route  PUT /api/v1/bootcamps/:id
//@access private

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
//@access private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();
  res
    .status(200)
    .json({ success: true, data: {}, alert: "Successfully deleted" });
});

//@desc Get Bootcamps within the radius of where you are located
//@route  GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access private

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
//@desc Upload photo for a Bootcamp
//@route  PUT /api/v1/bootcamps/:id/photo
//@access private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse("Please Upload file", 400));
  }
  const file = req.files.file;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please Upload an image file", 400));
  }
  //Check the file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `
      )
    );
  }
  //create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse("Problem with file upload", 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
