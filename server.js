const path = require('path');
const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const port = process.env.PORT || 3000;
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const logger = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const app = express();

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

//File Upload
app.use(fileUpload());

//Sanitize Data
app.use(mongoSanitize());

//Set Security Headers
app.use(helmet());

//Prevent XSS Attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 100, //10 minutes
  max: 150
});
app.use(limiter);

//Prevent http Param Polution
app.use(hpp());

//Enable CORS
app.use(cors());

//Set Static Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Connect to Database
connectDB();

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

//Use ErrorHandler - Must be placed after mounted routers
app.use(errorHandler);

//Start Server
const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold);
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  //Close Server & exit process
  server.close(() => process.exit(1));
});