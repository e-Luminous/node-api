let catchAsync = require('./../utils/catchAsync');
let User = require('./../models/userModel');
let jwt = require('jsonwebtoken');

let signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

let createSendToken = (user, statusCode, res) => {
  let token = signToken(user._id);
  /*
  let cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000) 
    ),
    httpOnly: true
  };
  */

  if (process.env.NODE_ENV === 'production')
    cookieOptions.secure = true;

  //res.cookie('jwt', token, cookieOptions);

  // Remove user password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'ok',
    token,
    date: {
      user
    }
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await User.create({
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  createSendToken(newUser, 201, res);
});