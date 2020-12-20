const express = require("express");
const request = require("request");
require("dotenv").config()

const bodyParser = require("body-parser");
const app = new express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});
app.post("/", (req, res) => {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.API_KEY}`
  request(url, (err, response, body) => {
    if (err) {
      res.render("index", { weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);
      if (weather.main === undefined) {
        res.render("index", {
          weather: null,
          error: "Error, please try again",
        });
      } else {
        let weat = weather.main.temp;
        let celsius = parseFloat(((weat - 32) * 5) / 9).toFixed(2);
        let weatherText = `It's ${celsius}°C in ${weather.name}`;
        res.render("index", { weather: weatherText, error: null });
      }
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listen on port 3000");
});
