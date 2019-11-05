const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const port = process.env.PORT || 3000;
const bootcamps = require('./routes/bootcamps');
const logger = require('morgan');
const app = express();

//Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

//Start Server
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});