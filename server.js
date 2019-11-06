const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const port = process.env.PORT || 3000;
const bootcamps = require('./routes/bootcamps');
const logger = require('morgan');
const connectDB = require('./config/db');
const app = express();

//Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

//Connect to Database
connectDB();

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

//Start Server
const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  //Close Server & exit process
  server.close(() => process.exit(1));
});