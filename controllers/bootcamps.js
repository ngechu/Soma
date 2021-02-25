//@desc Get all Bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ message: "show bootcamps" });
};

//@desc Get a Bootcamp
//@route  GET /api/v1/bootcamps/:id
//@access public

exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ message: "show bootcamp by id " + `${req.params.id}` });
};

//@desc Create a Bootcamp
//@route POST/api/v1/bootcamps
//@access public

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ message: "create  bootcamps" });
};

//@desc Update a Bootcamp
//@route  PUT /api/v1/bootcamps/:id
//@access public

exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ message: "edit bootcamp by id " + `${req.params.id}` });
};

//@desc Delete a Bootcamp
//@route  DELETE /api/v1/bootcamps/:id
//@access public

exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ message: "Delete bootcamp by id " + `${req.params.id}` });
};
