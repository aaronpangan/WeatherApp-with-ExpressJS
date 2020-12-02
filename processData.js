const d2d = require('degrees-to-direction');

module.exports = (place, data, date) => {
  // Assinging the data to a single object

  const item = {
    desc: place,
    country: data.sys.country,
    mainWeather: `${data.weather[0].main}`,
    weatherDesc: `${data.weather[0].description}`,
    currentTemp: `${(data.main.temp - 272.15).toFixed(2)}`,
    maxTemp: `${(data.main.temp_max - 272.15).toFixed(2)}`,
    minTemp: `${(data.main.temp_min - 272.15).toFixed(2)}`,
    humidity: `${data.main.humidity}%`,
    pressure: `${data.main.pressure} hPa`,
    wind: `${data.wind.speed}m/s ${d2d(data.wind.deg)}`,
  };

  return item;
};
