const express = require("express");
const request = require("request");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = new express();

app.set("view engine", "ejs");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.post("/", (req, response) => {
  let city = req.body.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.API_KEY}`;

  axios.get(url).then((res) => {
    let weather = res.data
    if (weather.main === undefined) {
      response.render("index", {
        weather: null,
        error: "Error, please try again!",
      });
    } else {
      let weat = weather.main.temp;
      let celsius = parseFloat(((weat - 32) * 5) / 9).toFixed(2);
      let weatherText = `It's ${celsius}°C in ${weather.name}`;
      response.render("index", { weather: weatherText, error: null });
    }
  });
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
