const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.set('view engine', 'ejs');

app.use('/', async (req, res) => {
  let data = await fetch(
    'https://api.openweathermap.org/data/2.5/weather?q=manilasds&appid=b89b3cb176bf02ce436c0ec42e9973fe'
  );

  data = await data.json();

  if ((data.cod = 404)) return res.status(404).send('Invalid City, Try Again');
  console.log(data.cod);

  console.log(data);
  res.send(data);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});

// res.render('index', { items: items });
