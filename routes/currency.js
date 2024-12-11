// currency.js - Currency Converter Router

// Create a new router
const express = require("express");
const router = express.Router();

// Import the request module
const request = require('request');

// Form to input currency details
router.get("/currencyconvert", function (req, res, next) {
    res.render("currencyconvert.ejs"); // Render a form for currency input
});

// Handle currency input and fetch exchange rates
router.post("/currencyconverted", function (req, res, next) {
    const apiKey = "cbeb5a1d8b8849f2a2479244ff4f0dcd"; // Your API Key
    const sourceCurrency = "GBP"; // Default source currency is GBP
    const targetCurrency = req.body.targetCurrency; // Target currency from form input
    const amount = req.body.amount; // Amount to convert from form input

    // Construct URL for the API request
    const url = `http://api.currencylayer.com/live?access_key=${apiKey}&source=${sourceCurrency}&currencies=${targetCurrency}&format=1`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            const data = JSON.parse(body);
            if (data.success) {
                const exchangeRate = data.quotes[`${sourceCurrency}${targetCurrency}`];
                const convertedAmount = (amount * exchangeRate).toFixed(2);
                res.send(`
                    <h1>Currency Conversion Result</h1>
                    <p>${amount} ${sourceCurrency} is equal to ${convertedAmount} ${targetCurrency}.</p>
                    <p>Current exchange rate: 1 ${sourceCurrency} = ${exchangeRate} ${targetCurrency}</p>
                    <br><br>
                    <a href="/currency/currencyconvert">Back to Currency Converter</a>
                `);
            } else {
                res.send("Error fetching currency data. Please try again.");
            }
        }
    });
});

// Export the router object so index.js can access it
module.exports = router;