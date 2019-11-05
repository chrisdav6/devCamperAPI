const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const port = process.env.PORT || 5000;
const app = express();

//Start Server
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
});