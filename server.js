const path = require('path');
const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const port = process.env.PORT || 3000;
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const logger = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
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

//Set Static Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Connect to Database
connectDB();

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

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