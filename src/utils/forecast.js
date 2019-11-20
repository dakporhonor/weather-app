// jshint esversion: 2015

const request = require("request");

const forecast = (latitude, longitude, location, callback) => {
  const url = `https://api.darksky.net/forecast/0905ed62308751c7fb4279d80dbb9ce6/${latitude},${longitude}?units=si`;

  request({
    url,
    json: true
  }, (error, response) => {
    if (error) {
      callback("Cannot get weather from weather services", undefined);
    } else {

      callback(undefined, {
        currently: response.body.currently,
        dailySummary: response.body.daily.summary
      });
    }
  });
};

module.exports = forecast;