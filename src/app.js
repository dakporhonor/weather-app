// jshint esversion: 2015

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const moment = require("moment");

const forecast = require("./utils/forecast");
const geolocation = require("./utils/geolocation");

const port = process.env.PORT || 5000;
const staticPath = path.join(__dirname, "../public");
console.log(staticPath);
const app = express();
app.use(express.static(staticPath));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.engine(
  "handlebars",
  exphbs({
    helpers: {
      formatDate: function(date, format) {
        return moment(date).format(format);
      }
    },
    defaultLayout: "main"
  })
);
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

  geolocation(address, (error, { latitude, longitude, location }) => {
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
      (error, { currently, dailySummary } = {}) => {
        if (error) {
          return res.render("weather", {
            error
          });
        }
        const date = Date().now;
        res.render("weather", {
          dailySummary,
          currently,
          location,
          date
        });
      }
    );
  });
});

app.get("/weather", (req, res) => {
  res.render("weather");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
