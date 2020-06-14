let express = require('express');
let morgan = require('morgan');

let AppError = require('./utils/appError');
let globalErrorHandler = require('./controllers/errorController');
let userRouter = require('./routes/userRoutes');

let app = express();

/******* Middlewares List ******/ 

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routers
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;