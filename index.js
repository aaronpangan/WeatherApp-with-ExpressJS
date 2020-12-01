const express = require('express');
const fetch = require('node-fetch');
const app = express();
const bodyparser = require('body-parser');
const geoTz = require('geo-tz');
const d2d = require('degrees-to-direction');
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: false }));

// For rendering the Input Field
app.get('/', async (req, res) => {
  let convert = Intl.DateTimeFormat().resolvedOptions().timeZone + '';

  convert = convert.split('/');

  let data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${convert[1]}&appid=b89b3cb176bf02ce436c0ec42e9973fe`
  );

  data = await data.json();

  let timezone = geoTz(data.coord.lat, data.coord.lon);
  let date =
    new Date().toLocaleString('en-US', {
      timeZone: timezone,
    }) + '';

  const item = {
    desc: 'This is your weather',
    mainWeather: data.weather[0].main,
    weatherDesc: data.weather[0].description,
    currentTemp: `${data.main.temp} Degrees Celsius`,
    humidity: `${data.main.humidity}% Humidity`,
    pressure: `${data.main.pressure} hPa`,
    wind: `${data.wind.speed}m/s ${d2d(data.wind.deg)}`,
    time: date,
  };

  console.log(data);

  res.render('index', { item });
});

// To show the result
app.post('/', async (req, res) => {
  let data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=b89b3cb176bf02ce436c0ec42e9973fe`
  );

  data = await data.json();

  // If the input is invalid
  if (data.cod != 200) return res.status(404).send('Invalid City, Try Again');

  let timezone = geoTz(data.coord.lat, data.coord.lon);

  let date =
    new Date().toLocaleString('en-US', {
      timeZone: timezone,
    }) + '';

  const item = {
    desc: `You search for ${req.body.city}`,
    mainWeather: data.weather[0].main,
    weatherDesc: data.weather[0].description,
    currentTemp: `${data.main.temp} Degrees Celsius`,
    humidity: `${data.main.humidity}% Humidity`,
    pressure: `${data.main.pressure} hPa`,
    wind: `${data.wind.speed}m/s ${d2d(data.wind.deg)}`,
    time: date,
  };
  console.log(date);
  console.log(timezone);
  // Render index.ejs with the result
  res.render('index', { item });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});

['Asia', 'Manila'];
