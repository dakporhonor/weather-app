// jshint esversion: 2015

const request = require("request");

const geolocation = (location, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1IjoiZGV2ZGFmZSIsImEiOiJjazMxY3Z6ZjAwNzZmM25xankycmUwejcyIn0.zNLq2dVLUrVbOQZmTOqfdw`;

  request({
    url,
    json: true
  }, (error, {
    body
  } = {}) => {
    if (error) {
      callback("Cannot get location from service", undefined);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name
      });
    }
  });
};

module.exports = geolocation;