const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//@desc Register User
//@route POST /api/v1/auth/register
//@access public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create User
  const user = await User.create({ name, email, password, role });

  //create token
  sendTokenResponse(user, 200, res);
});

//@desc Register User
//@route POST /api/v1/auth/login
//@access public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate Email and Password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  //Check for user
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials !!", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials !!", 401));
  }

  //create token
  sendTokenResponse(user, 200, res);
});

//Get token from model and also send token response

const sendTokenResponse = (user, statusCode, response) => {
  //create token
  const token = user.getSignedjwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  response
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });

  response.status(200).json({ success: true, token: token });
};
