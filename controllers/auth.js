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
  const token = user.getSignedjwtToken();
  res.status(200).json({ success: true, token: token });
});
