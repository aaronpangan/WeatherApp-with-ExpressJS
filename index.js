const express = require('express');
// For Fetching Api
const fetch = require('node-fetch');
const app = express();
const bodyparser = require('body-parser');
require('dotenv').config();
const publicIp = require('public-ip');

// For getting the timezone based on latitude, longtitude
const geoTz = require('geo-tz');

// to assign the values to an object
const processData = require('./processData');

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: false }));

// Getting the weather based on your location
app.get('/', async (req, res) => {
  // For getting your timezone based on your ip address

  const myIp = await publicIp.v4();
  let geoLoc = await fetch(`http://ip-api.com/json/${myIp}`);
  geoLoc = await geoLoc.json();

  // Fetching current weather in your location
  let data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${geoLoc.city}&appid=b89b3cb176bf02ce436c0ec42e9973fe`
  );

  data = await data.json();

  // Getting the your time
  let timezone = await geoTz(data.coord.lat, data.coord.lon);
  let date =
    new Date().toLocaleString('en-US', {
      timeZone: timezone,
    }) + '';

  // Arranging the values to processData.js then assign to a variable
  const item = processData('This is your current weather', data, date);

  console.log(data);
  console.log(geoLoc);

  // Render the data to ejs file
  res.render('index', { item });
});

// To show the result of your searched city
app.post('/', async (req, res) => {
  // Getting the api based on your searched city
  let data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=b89b3cb176bf02ce436c0ec42e9973fe`
  );

  data = await data.json();

  // If the input is invalid
  if (data.cod != 200) return res.status(404).send('Invalid City, Try Again');

  // Getting the timezone of that city
  let timezone = await geoTz(data.coord.lat, data.coord.lon);

  // Getting the timezone of that city
  let date =
    new Date().toLocaleString('en-US', {
      timeZone: timezone,
    }) + '';

  // Arranging the values to processData.js then assign to a variable
  const item = processData(`You searched for ${req.body.city}`, data, date);

  // Render index.ejs with the result
  res.render('index', { item });
});

// Arranging the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
