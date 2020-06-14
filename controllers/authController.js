let jwt = require('jsonwebtoken');
let catchAsync = require('./../utils/catchAsync');
let AppError = require('./../utils/appError');
let User = require('./../models/userModel');


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

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  // Check email and password exist
  if (!email || !password) {
    next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists & password is correct
  let user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // If everything is ok, then send token to client
  createSendToken(user, 200, res);
});