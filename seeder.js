const fs = require('fs');
require('dotenv').config({ path: './config/config.env' });
const asyncHandler = require('./middleware/async');
const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = require('./config/db');

//Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

//Connect to DB
connectDB();

//Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

//Clear DB then save new data
const importData = asyncHandler(async () => {
  await Bootcamp.deleteMany();
  await Course.deleteMany();
  await Bootcamp.create(bootcamps);
  await Course.create(courses);
  console.log(`Old data deleted!`.red.inverse);
  console.log(`New data Seeded!`.green.inverse);
  mongoose.connection.close();
});

importData();