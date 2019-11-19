// jshint esversion: 2015

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const forecast = require("./utils/forecast");
const geolocation = require("./utils/geolocation");

const port = process.env.PORT || 5000;

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("home", {
    name: "Danny"
  });
});

let address = "";

// Handle Post
app.post("/", (req, res) => {
  address = req.body.address;
  console.log(address);
  if (!address) {
    return res.render("weather", {
      error: "You must provide a valid Address"
    });
  }
  if (!address) {
    return res.render("weather", {
      error: "You must provide a location!"
    });
  }

  geolocation(address, (error, {
    latitude,
    longitude,
    location
  }) => {
    if (error) {
      return res.render("weather", {
        error
      });
    }
    console.log(latitude, longitude, location);

    forecast(
      latitude,
      longitude,
      location,
      (error, {
        currently,
        dailySummary
      } = {}) => {
        if (error) {
          return res.render("weather", {
            error
          });
        }
        console.log(currently);
        res.render("weather", {
          dailySummary,
          currently
        });
      }
    );
  });
});

app.get("/weather", (req, res) => {
  res.render('weather');

});

app.get("/about", (req, res) => {
  res.send("About");
});

app.get("*", (req, res) => {
  res.send("404. Page not found!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});