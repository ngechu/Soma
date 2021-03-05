const Bootcamp = require('../models/Bootcamp');

//@desc Get all Bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Get a Bootcamp
//@route  GET /api/v1/bootcamps/:id
//@access public

exports.getBootcamp = (req, res, next) => {
  try {
  } catch (err) {}
  res
    .status(200)
    .json({ message: 'show bootcamp by id ' + `${req.params.id}` });
};

//@desc Create a Bootcamp
//@route POST/api/v1/bootcamps
//@access public

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Update a Bootcamp
//@route  PUT /api/v1/bootcamps/:id
//@access public

exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ message: 'edit bootcamp by id ' + `${req.params.id}` });
};

//@desc Delete a Bootcamp
//@route  DELETE /api/v1/bootcamps/:id
//@access public

exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ message: 'Delete bootcamp by id ' + `${req.params.id}` });
};
