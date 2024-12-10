// Create a new router
const express = require("express")
const router = express.Router()
// Import the request module
const request = require('request')

// Form to input city name
router.get("/weather", function (req, res, next) {
    res.render("weather_form.ejs"); // Render a form for city input
});

// Handle city input and fetch weather
router.post("/weather", function (req, res, next) {
    let apiKey = "1be35257863932ddf7397da5f5b92ecd";
    let city = req.body.city; // Get city name from form input
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            let weather = JSON.parse(body);
            if (weather.cod === 200) { // Check if the city exists
                let wmsg =
                    `It is ${weather.main.temp} degrees in ${weather.name}! <br>` +
                    `The humidity now is: ${weather.main.humidity}`;
                res.send(wmsg);
            } else {
                res.send("City not found. Please try again.");
            }
        }
    });
});

// Export the router object so index.js can access it
module.exports = router